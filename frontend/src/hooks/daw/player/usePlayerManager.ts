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

  const [parts, setParts] = createSignal<Tone.Part[]>([]);

  let isAudioEngineInitialized = false;

  const startOrPausePlaying = async () => {
    if (!isAudioEngineInitialized) {
      await Tone.start();
      isAudioEngineInitialized = true;
    }

    const transport = Tone.getTransport();

    if (isPlaying()) {
      transport.stop();
      transport.cancel();
      setIsPlaying(false);
      parts().forEach((p) => p.dispose());
      setParts([]);
      audioEngine.getAllAudioPlayers().forEach((player) => {
        // player.stop();
        player.unsync();
      });
      return;
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

          const synth = audioEngine.getInstrument(track.trackId);

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
          const audioClip = audioEngine.getAudioPlayer(pattern.patternId);
          if (!audioClip) return;

          if (pattern.pos >= startPosInBars) {
            const time =
              (pattern.pos - startPosInBars) *
              currentBeatNumber *
              (60 / currentBpm);

            audioClip.sync().start(time);
          } else {
            const time = 0;
            const offset =
               (startPosInBars - pattern.pos) *
              (60 / currentBpm) * currentBeatNumber;

            audioClip.sync().start(time, offset);
          }
        }
      });
    });

    setParts(newParts);
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
