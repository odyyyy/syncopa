import * as Tone from "tone";
import { PolySynthInstance } from "../types/presets.types";

const activeInstruments = new Map<
  string,
  Tone.ToneAudioNode | PolySynthInstance
>();

export const audioEngine = {
  setInstrument(
    trackId: string,
    instrument: Tone.ToneAudioNode | PolySynthInstance,
  ) {
    const old = activeInstruments.get(trackId);
    if (old) {
      "dispose" in old && old.dispose();
      old instanceof Tone.ToneAudioNode && old.dispose();
    }

    if ("toDestination" in instrument) instrument.toDestination();
    activeInstruments.set(trackId, instrument);
  },

  getInstrument(trackId: string) {
    return activeInstruments.get(trackId);
  },
};
