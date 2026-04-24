import { createSignal } from "solid-js";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { useProjectContext } from "@/context/daw/project.context";
import { usePlayerContext } from "@/context/daw/player.context";
import toWav from "audiobuffer-to-wav";
import * as Tone from "tone";
import { Track } from "../../../types/daw.types";
import { PolySynthInstance, SamplerWithUrls, Synth } from "../../../types/presets.types";
import { audioEngine } from "../../../instruments/audioEngine";
import { createPolySynth } from "../../../instruments/createSynth";

const useExportProject = () => {
  const [exportOpen, setExportOpen] = createSignal(false);
  const { tracks } = useProjectContext();
  const { bpm } = usePlayerContext();
  const { beatNumber } = useTimelineContext();

  const calculateProjectDuration = () => {
    let maxBar = 0;
    tracks.forEach((track) => {
      track.patterns?.forEach((p) => {
        maxBar = Math.max(maxBar, p.pos + p.width);
      });
    });

    return (maxBar * beatNumber() * 60) / bpm();
  };

  const audioBufferToWav = (buffer: AudioBuffer) => {
    return toWav(buffer);
  };

  const { project } = useProjectContext();
  const downloadProjectAudio = (buffer: AudioBuffer) => {
    const wav = audioBufferToWav(buffer);
    const blob = new Blob([wav], { type: "audio/wav" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project()?.title}.wav`;
    a.click();
  };
  

  const createInstrumentOffline = async (track: Track) => {
    const preset = audioEngine.getInstrument(track.trackId);
  
    if ((preset as PolySynthInstance).type === "polySynth" && "config" in (preset as PolySynthInstance)) {
      return createPolySynth((preset as PolySynthInstance).config as Synth)
    }
  
    if (preset instanceof Tone.Sampler && "samplesUrls" in preset) {
      return new Promise<Tone.Sampler>((resolve, reject) => {
            const sampler = new Tone.Sampler({
              urls: (preset as SamplerWithUrls).samplesUrls,
              onload: () => {
                resolve(sampler.toDestination());
              },
              onerror: (err) => {
                reject(err);
              }
            });
          });
        }
  };

  const exportProjectAudio = async () => {
    const projectDuration = calculateProjectDuration();

    const buffer = await Tone.Offline(async () => {
      Tone.getTransport().bpm.value = bpm();

      for (const track of tracks) {
        const instrument = await createInstrumentOffline(track); 
        if (!instrument) continue;

        track.patterns?.forEach((pattern) => {
          if (pattern.type !== "vst" || !pattern.notes) return;

          pattern.notes.forEach((note) => {
            const time =
              (pattern.pos + (note.pos - 1) / beatNumber()) *
              (60 / bpm()) *
              beatNumber();

            const duration = note.duration * (60 / bpm());

            instrument?.triggerAttackRelease(
              note.note,
              duration,
              time,
              note.velocity,
            );
          });
        });
      }

      Tone.getTransport().start();
    }, projectDuration);
    
    downloadProjectAudio(buffer.get()!);
    
    
  };

  return {
    exportOpen,
    setExportOpen,
    exportProjectAudio,
  };
};

export default useExportProject;
