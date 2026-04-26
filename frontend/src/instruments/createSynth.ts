import { PolySynthInstance, Synth, Voice } from "../types/presets.types";
import * as Tone from "tone";

type AnyOsc = Tone.Oscillator | Tone.FatOscillator;

function createVoice(config: Synth): Voice {
  const output = new Tone.Gain();

  const ampEnv = new Tone.AmplitudeEnvelope(config.envelope);

  const filter = config.filter
    ? new Tone.Filter({
        type: config.filter.type,
        frequency: config.filter.frequency,
        Q: config.filter.q ?? 1,
        rolloff: (config.filter.rolloff ?? -12) as -12 | -24 | -48 | -96,
      })
    : undefined;

  const filterEnv =
    config.filter_envelope && filter
      ? new Tone.FrequencyEnvelope({
          attack: config.filter_envelope.attack,
          decay: config.filter_envelope.decay,
          sustain: config.filter_envelope.sustain,
          release: config.filter_envelope.release,
          baseFrequency: config.filter_envelope.baseFrequency ?? 200,
          octaves: config.filter_envelope.octaves ?? 2,
        })
      : undefined;

  if (filterEnv && filter) {
    filterEnv.connect(filter.frequency);
  }

  const oscillators: AnyOsc[] = config.oscilators.map((osc) => {
    let node: AnyOsc;

    if (osc.specific_oscillator?.type === "fat") {
      node = new Tone.FatOscillator({
        type: osc.type,
        ...osc.specific_oscillator.params,
      });
    } else {
      node = new Tone.Oscillator({
        type: osc.type,
      });
    }

    if (osc.detune !== undefined) node.detune.value = osc.detune;
    if (osc.volume !== undefined) node.volume.value = osc.volume;

    return node;
  });

  oscillators.forEach((osc) => {
    if (filter) osc.connect(filter);
    else osc.connect(ampEnv);

    osc.start();
  });

  if (filter) filter.connect(ampEnv);
  ampEnv.connect(output);

  return {
    oscillators,
    filter,
    ampEnv,
    filterEnv,
    output,
    active: false,
  };
}

export function createPolySynth(config: Synth): PolySynthInstance {
  const voices: Voice[] = [];
  const poolSize = 8;

  const master = new Tone.Gain(config.gain ?? 0.5);

  let current: Tone.ToneAudioNode = master;

  if (config.effects) {
    config.effects.forEach((fx) => {
      let node: Tone.ToneAudioNode | null = null;

      switch (fx.type) {
        case "distortion":
          node = new Tone.Distortion(fx.amount);
          break;

        case "reverb":
          node = new Tone.Reverb({
            decay: fx.decay,
            wet: fx.wet,
          });
          break;

        case "delay":
          node = new Tone.FeedbackDelay({
            delayTime: fx.time,
            feedback: fx.feedback,
            wet: fx.wet,
          });
          break;
      }

      if (node) {
        current.connect(node);
        current = node;
      }
    });
  }

  current.toDestination();

  for (let i = 0; i < poolSize; i++) {
    const v = createVoice(config);
    v.output.connect(master);
    voices.push(v);
  }

  function getFreeVoice(): Voice {
    const free = voices.find((v) => !v.active);
    if (free) return free;

    const v = voices.shift()!;
    voices.push(v);
    return v;
  }

  function triggerAttackRelease(
    note: string,
    duration: number,
    time = Tone.now(),
    velocity = 1
  ) {
    const voice = getFreeVoice();
    const freq = Tone.Frequency(note).toFrequency();

    voice.active = true;

    voice.oscillators.forEach((osc) => {
      osc.frequency.setValueAtTime(freq, time);
    });

    voice.ampEnv.triggerAttackRelease(duration, time, velocity);
    voice.filterEnv?.triggerAttackRelease(duration, time);

    const releaseTime =
      Tone.Time(duration).toSeconds() +
      Tone.Time(config.envelope.release).toSeconds();

    Tone.getTransport().scheduleOnce(() => {
      voice.active = false;
    }, time + releaseTime);
  }

  function dispose() {
    voices.forEach((v) => {
      v.oscillators.forEach((o) => o.dispose());
      v.filter?.dispose();
      v.ampEnv.dispose();
      v.filterEnv?.dispose();
      v.output.dispose();
    });

    master.dispose();
  }

  return {
    type: "polySynth",
    config,
    triggerAttackRelease,
    output: current,
    dispose,
    setVolume: (v: number) => master.gain.rampTo(v, 0.05)
  };
}