import { usePlayerContext } from "@/context/daw/player.context";
import { useProjectContext } from "@/context/daw/project.context";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { audioEngine } from "@/instruments/audioEngine";
import { PolySynthInstance } from "@/types/presets.types";
import { createSignal } from "solid-js";
import * as Tone from "tone";

const usePlayerManager = () => {
  const { tracks } = useProjectContext();
  const { beatNumber } = useTimelineContext();
  const { bpm, isPlaying, setIsPlaying, playerBeatPos, setPlayerBeatPos } =
    usePlayerContext();
  const [isAudioEngineInitialized, setIsAudioEngineInitialized] =
    createSignal(false);

  const [parts, setParts] = createSignal<Tone.Part[]>([]);

  const startOrPausePlaying = async () => {
    if (!isAudioEngineInitialized()) {
      await Tone.start();
      setIsAudioEngineInitialized(true);
    }

    const transport = Tone.getTransport();

    if (isPlaying()) {
      transport.stop();
      transport.cancel();
      parts().forEach((p) => p.dispose());
      setIsPlaying(false);
      setParts([]);
      audioEngine.getAllAudioPlayers().forEach((player) => player?.unsync());
      return;
    }

    if (Tone.getContext().state !== "running") {
      await Tone.getContext().resume();
    }

    setIsPlaying(true);

    parts().forEach((p) => p.dispose());

    const currentBpm = bpm();
    const currentBeatNumber = beatNumber();
    const startPosInBars = playerBeatPos();

    const newParts: Tone.Part[] = [];

    tracks.forEach((track) => {
      track.patterns?.forEach((pattern) => {
        if (pattern.type === "vst" && pattern.notes) {
          const synth = audioEngine.getInstrument(track.trackId);
          if (!synth) {
            return;
          }

          const patternStartBar = pattern.pos;
          const patternEndBar = pattern.pos + pattern.width;

          if (patternEndBar < startPosInBars) return;

          const events = pattern.notes
            .map((n) => {
              const absoluteNoteBar =
                patternStartBar + (n.pos - 1) / currentBeatNumber;

              return {
                barPos: absoluteNoteBar,
                note: n.note,
                duration: n.duration * (60 / currentBpm),
                velocity: n.velocity,
              };
            })
            .filter((e) => e.barPos >= startPosInBars);

          if (events.length > 0) {
            const part = new Tone.Part(
              (time, val) => {
                (synth as PolySynthInstance).triggerAttackRelease(
                  val.note,
                  val.duration,
                  time,
                  val.velocity,
                );
              },
              events.map((e) => ({
                time:
                  (e.barPos - startPosInBars) *
                  currentBeatNumber *
                  (60 / currentBpm),
                ...e,
              })),
            ).start(0);

            newParts.push(part);
          }
        } else if (pattern.type === "audio") {
          let time = 0;
          let offset = 0;
          const audioClip = audioEngine.getAudioPlayer(pattern.patternId);
          if (!audioClip) return;

          if (pattern.pos >= startPosInBars) {
            time =
              (pattern.pos - startPosInBars) *
              currentBeatNumber *
              (60 / currentBpm);
            offset = 0;

            // audioClip.sync().start(time);
          } else {
            time = 0;
            offset =
              (startPosInBars - pattern.pos) *
              (60 / currentBpm) *
              currentBeatNumber;

            // audioClip.unsync();
            // audioClip.sync().start(time, offset);
          }
          transport.schedule((t) => {
            audioClip.start(t, offset);
          }, time);
          
          // audioClip.unsync();
          // audioClip.sync().start(time, offset);
        }
      });
    });

    setParts(newParts);
    transport.bpm.value = currentBpm;
    transport.seconds = 0;
    transport.start();

    const updateUI = () => {
      if (transport.state === "started") {
        const secondsElapsed = transport.seconds;

        const totalBeatsElapsed = (secondsElapsed * currentBpm) / 60;
        const barsElapsed = totalBeatsElapsed / currentBeatNumber;

        setPlayerBeatPos(startPosInBars + barsElapsed);

        requestAnimationFrame(updateUI);
      }
    };
    requestAnimationFrame(updateUI);
  };

  return { startOrPausePlaying };
};

export default usePlayerManager;
