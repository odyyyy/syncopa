import * as Tone from "tone";
import { createStore } from "solid-js/store";
import { PolySynthInstance } from "../types/presets.types";

type Instrument = Tone.ToneAudioNode | PolySynthInstance;

const [instruments, setInstruments] = createStore<
  Record<string, Instrument | undefined>
>({});
const [audioPlayers, setAudioPlayers] = createStore<
  Record<string, Tone.Player | undefined>
>({});

export const audioEngine = {
  setInstrument(trackId: string, instrument: Instrument) {
    const old = instruments[trackId];
    if (old) {
      if ("dispose" in old) old.dispose();
      if (old instanceof Tone.ToneAudioNode) old.dispose();
    }

    if ("toDestination" in instrument) {
      instrument.toDestination();
    }
    setInstruments(trackId, instrument);
  },
  getInstrument(trackId: string) {
    return instruments[trackId];
  },

  removeInstrument(trackId: string) {
    const inst = instruments[trackId];
    if (inst) {
      if ("dispose" in inst) inst.dispose();
      if (inst instanceof Tone.ToneAudioNode) inst.dispose();
    }
    setInstruments(trackId, undefined!);
  },

  isLoaded(trackId: string) {
    const inst = instruments[trackId];
    if (!inst) return false;
    return !(inst instanceof Tone.Sampler) || (inst as Tone.Sampler).loaded;
  },

  async addAudioPlayer(patternId: string, audio: string | AudioBuffer) {
    const player = new Tone.Player({
      url: audio,
    }).toDestination();

    await Tone.loaded();
    setAudioPlayers(patternId, player);
  },

  getAudioPlayer(patternId: string) {
    
    return audioPlayers[patternId]; 
  },

  getAllAudioPlayers() {
    return Object.values(audioPlayers).filter(Boolean);
  },
};
