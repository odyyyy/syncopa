import { useProjectContext } from "@/context/daw/project.context";
import { audioEngine } from "@/instruments/audioEngine";
import { Track } from "@/types/daw.types";
import {
  DelayConfig,
  DistortionConfig,
  Effect,
  ReverbConfig,
} from "@/types/presets.types";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import * as Tone from "tone";

const effectNodesCache = new Map<string, Tone.ToneAudioNode>();

export const FX_DATA = {
  REVERB: {
    id: "reverb",
    name: "Reverb",
    params: [
      {
        label: "Decay",
        key: "decay",
        min: 0.1,
        max: 10,
        unit: "s",
        default: 2,
      },
      {
        label: "Pre-Delay",
        key: "preDelay",
        min: 0,
        max: 1,
        unit: "s",
        default: 0.03,
      },
      { label: "Wet", key: "wet", min: 0, max: 100, unit: "%", default: 25 },
    ],
  },
  DELAY: {
    id: "delay",
    name: "Delay",
    params: [
      { label: "Time", key: "time", min: 0, max: 16, unit: "step", default: 8 },
      {
        label: "Feedback",
        key: "feedback",
        min: 0,
        max: 100,
        unit: "%",
        default: 35,
      },
      { label: "Wet", key: "wet", min: 0, max: 100, unit: "%", default: 25 },
    ],
  },
  DISTORTION: {
    id: "distortion",
    name: "Distortion",
    params: [
      {
        label: "Amount",
        key: "amount",
        min: 0,
        max: 100,
        unit: "%",
        default: 20,
      },
      { label: "Wet", key: "wet", min: 0, max: 100, unit: "%", default: 50 },
    ],
  },
};

const useEffectsManager = () => {
  const { setTracks } = useProjectContext();

  const createEffectParamsStore = () => {
    const initialValues: Record<string, number> = {};
    Object.values(FX_DATA).forEach((effect) => {
      effect.params.forEach((param) => {
        initialValues[param.key] = param.default;
      });
    });
    const [effectParams, setEffectParams] = createSignal(initialValues);
    return { effectParams, setEffectParams };
  };

  const applyEffectToPattern = (patternId: string, effectParams: Effect) => {
    const { type } = effectParams;

    let targetTrackId = "";
    let targetPatternType: "vst" | "audio";

    setTracks((prev) =>
      prev.map((track) => {
        const hasPattern = track.patterns?.some(
          (p) => p.patternId === patternId,
        );
        if (!hasPattern) return track;

        targetTrackId = track.trackId;
        return {
          ...track,
          patterns: track.patterns!.map((p) => {
            if (p.patternId !== patternId) return p;
            targetPatternType = p.type;
            return {
              ...p,
              effects: [
                ...(p.effects || []).filter((e) => e.type !== type),
                effectParams,
              ],
            };
          }),
        };
      }),
    );
    if (!targetPatternType!) return;

    const sourceId = targetPatternType! === "vst" ? targetTrackId : patternId;
    connectEffectToSource(targetPatternType!, sourceId, effectParams);
  };

  const connectEffectToSource = (
    targetPatternType: "vst" | "audio",
    targetId: string,
    effectParams: Effect,
  ) => {
    const { type } = effectParams;
    const cacheKey = `${targetId}-${type}`;

    if (effectNodesCache.has(cacheKey)) {
      effectNodesCache.get(cacheKey)?.dispose();
    }

    const normalized = normalizeEffectParams(type, effectParams);
    const effectNode = toneEffectFactory(normalized as Effect);
    effectNodesCache.set(cacheKey, effectNode);

    const instrumentOrPlayer =
      targetPatternType === "vst"
        ? audioEngine.getInstrument(targetId)
        : audioEngine.getAudioPlayer(targetId);

    if (instrumentOrPlayer) {
      const sourceNode =
        (instrumentOrPlayer as any).type === "polySynth"
          ? (instrumentOrPlayer as any).output
          : (instrumentOrPlayer as Tone.ToneAudioNode);

      sourceNode.disconnect();
      sourceNode.chain(effectNode, Tone.getDestination());
    }
  };

  const removeEffectFromPattern = (patternId: string, effectType: string) => {
    let targetTrackId = "";
    let targetPatternType = "";

    setTracks((prev) =>
      prev.map((track) => {
        const hasPattern = track.patterns?.some(
          (p) => p.patternId === patternId,
        );
        if (!hasPattern) return track;

        targetTrackId = track.trackId;
        return {
          ...track,
          patterns: track.patterns!.map((p) => {
            if (p.patternId !== patternId) return p;
            targetPatternType = p.type;
            return {
              ...p,
              effects: (p.effects || []).filter((e) => e.type !== effectType),
            };
          }),
        };
      }),
    );

    const cacheKey = `${patternId}-${effectType}`;
    if (effectNodesCache.has(cacheKey)) {
      const node = effectNodesCache.get(cacheKey);
      node?.disconnect();
      node?.dispose();
      effectNodesCache.delete(cacheKey);
    }

    if (targetPatternType === "vst") {
      const instrument = audioEngine.getInstrument(targetTrackId);
      if (instrument) {
        const sourceNode =
          (instrument as any).type === "polySynth"
            ? (instrument as any).output
            : (instrument as Tone.ToneAudioNode);

        sourceNode.disconnect();
        sourceNode.toDestination();
      }
    } else if (targetPatternType === "audio") {
      const player = audioEngine.getAudioPlayer(patternId);
      if (player) {
        player.disconnect();
        player.toDestination();
      }
    }
    toast.success("Эффект удален");
  };

  const initializeProjectEffects = (tracks: Track[]) => {
    tracks.forEach((track) => {
      if (track.presetId !== -1) {
        const patternWithEffects = track.patterns?.find(
          (p) => p.effects && p.effects.length > 0,
        );

        if (patternWithEffects && patternWithEffects.effects) {
          patternWithEffects.effects.forEach((effect) => {
            connectEffectToSource("vst", track.trackId, effect);
          });
        }
      } else if (track.presetId === -1) {
        track.patterns?.forEach((pattern) => {
          if (pattern.effects && pattern.effects.length > 0) {
            pattern.effects.forEach((effect) => {
              connectEffectToSource("audio", pattern.patternId, effect);
            });
          }
        });
      }
    });
  };

  return {
    applyEffectToPattern,
    removeEffectFromPattern,
    initializeProjectEffects,
    createEffectParamsStore,
  };
};

export default useEffectsManager;

const normalizeEffectParams = (type: string, params: Record<string, any>) => {
  const wet = (params.wet ?? 0) / 100;

  switch (type) {
    case "reverb":
      return {
        type,
        decay: params.decay,
        preDelay: params.preDelay,
        wet,
      };
    case "delay":
      return {
        type,
        time: `${params.time}n`,
        feedback: params.feedback / 100,
        wet,
      };
    case "distortion":
      return {
        type,
        amount: params.amount / 100,
        wet,
      };
    default:
      return { ...params, wet };
  }
};

const toneEffectFactory = (effectParams: Effect): Tone.ToneAudioNode => {
  const { type, ...params } = effectParams;

  switch (type) {
    case "reverb":
      return new Tone.Reverb(params as ReverbConfig);
    case "delay":
      return new Tone.FeedbackDelay(params as DelayConfig);
    case "distortion":
      const dist = new Tone.Distortion((params as any).amount);
      dist.wet.value = (params as any).wet;
      return dist;
    default:
      return new Tone.Gain();
  }
};
