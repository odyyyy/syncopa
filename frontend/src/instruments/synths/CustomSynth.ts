import * as Tone from "tone";


class CustomVoice {
  private mainOsc: Tone.FatOscillator;
  private subOsc: Tone.Oscillator;
  private filter: Tone.Filter;
  private ampEnv: Tone.AmplitudeEnvelope;
  private filterEnv: Tone.FrequencyEnvelope;
  
  public activeNote: string | null = null;
  public output: Tone.Gain;

  constructor() {
    this.output = new Tone.Gain();
    
    this.mainOsc = new Tone.FatOscillator({
      type: "sawtooth",
      count: 3,
      spread: 20
    });

    this.subOsc = new Tone.Oscillator("C3", "square");
    this.subOsc.volume.value = -10;

    this.filter = new Tone.Filter({ 
      type: "lowpass", 
      rolloff: -12, 
      Q: 1 
    });

    this.ampEnv = new Tone.AmplitudeEnvelope({ 
      attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.5 
    });

    this.filterEnv = new Tone.FrequencyEnvelope({ 
      attack: 0.04, baseFrequency: 100, octaves: 4 
    });
    

    this.mainOsc.connect(this.filter);
    this.subOsc.connect(this.filter);

    this.filter.connect(this.ampEnv);
    this.filterEnv.connect(this.filter.frequency);
    this.ampEnv.connect(this.output);
  }

  trigger(note: string, duration: number, time: number, velocity: number) {
    this.activeNote = note;
    const freq = Tone.Frequency(note).toFrequency();
    
    this.mainOsc.frequency.setValueAtTime(freq, time);
    this.subOsc.frequency.setValueAtTime(freq / 2, time);
    
    this.mainOsc.start(time).stop(time + duration + 1);
    this.subOsc.start(time).stop(time + duration + 1);

    this.ampEnv.triggerAttackRelease(duration, time, velocity);
    this.filterEnv.triggerAttackRelease(duration, time);
    
    const releaseTime = Tone.Time(duration).toSeconds() + Tone.Time(this.ampEnv.release).toSeconds();
    Tone.getDraw().schedule(() => {
      this.activeNote = null;
    }, time + releaseTime);
  }

  connect(target: Tone.ToneAudioNode) {
    this.output.connect(target);
  }

  dispose() {
    [this.mainOsc, this.subOsc, this.filter, this.ampEnv, this.filterEnv, this.output].forEach(n => n.dispose());
  }
}

class CustomSynth {
  private voices: CustomVoice[] = [];
  private mainBus: Tone.Gain;
  private limiter: Tone.Limiter;
  private poolSize = 8; 

  constructor() {
    this.mainBus = new Tone.Gain(0.6);
    this.limiter = new Tone.Limiter(-2);
    this.mainBus.chain(this.limiter, Tone.getDestination());

    for (let i = 0; i < this.poolSize; i++) {
      const v = new CustomVoice();
      v.connect(this.mainBus);
      this.voices.push(v);
    }
  }

  triggerAttackRelease(note: string, duration: number, time = Tone.now(), velocity = 0.8) {
    let voice = null;
    for (let i = 0; i < this.voices.length; i++) {
        if (this.voices[i]!.activeNote === null) {
            voice = this.voices[i];
            break;
        }
    }
    
    if (!voice) {
      voice = this.voices[0];
      this.voices.push(this.voices.shift()!);
    }
    voice!.trigger(note, duration, time, velocity);
  }

  dispose() {
    this.voices.forEach(v => v.dispose());
    this.mainBus.dispose();
    this.limiter.dispose();
  }
}

export default CustomSynth;