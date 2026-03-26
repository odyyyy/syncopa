from typing import Annotated, Any, Literal, Optional, Union

from pydantic import BaseModel, constr

from daw.models.presets import PresetsCategories
from shared.base_schema import BaseSchema


class PresetOut(BaseSchema):
    id: int
    title: str
    description: str
    category: PresetsCategories
    preview_sound: str | None


class PresetWithConfigOut(BaseSchema):
    preset: PresetOut
    preset_config: "PresetConfig"


class PresetConfig(BaseSchema):
    type: Literal["sampler", "synth"]
    config: Union["Sampler", "Synth"]


Note = Annotated[str, constr(pattern=r"^[A-G]#?\d$")]
SamplePath = Annotated[str, constr(pattern=r".+\.(mp3|wav|ogg)$")]


class Sampler(BaseSchema):
    samples_urls: dict[Note, SamplePath]
    volume: float | None
    release: float | None
    attack: float | None
    curve: Literal["linear", "exponential"] | None


class Synth(BaseModel):
    oscilators: list["Oscillator"]
    envelope: "Envelope"
    filter: Optional["Filter"]
    filter_envelope: Optional["FilterEnvelope"]
    gain: float | None = 1.0

    effects: (
        list[Union["LFOConfig", "DistortionConfig", "ReverbConfig", "DelayConfig"]]
        | None
    )


class Oscillator(BaseModel):
    type: Literal["sine", "sawtooth", "square", "triangle"]
    frequency: float
    detune: float | None
    volume: float | None
    specific_oscillator: Optional["SpecificOscillator"]


class Envelope(BaseModel):
    attack: float
    decay: float
    sustain: float
    release: float


class FilterEnvelope(BaseModel):
    attack: float
    decay: float
    sustain: float
    release: float

    baseFrequency: float | None = None
    octaves: float | None = None


class Filter(BaseModel):
    type: Literal["lowpass", "highpass", "bandpass", "notch"]
    frequency: float
    q: float = 1
    rolloff: int | None = -12


class SpecificOscillator(BaseModel):
    type: Literal["fat", "fm", "am"]
    # TODO: specify params
    params: dict[str, Any]


class LFOConfig(BaseModel):
    type: Literal["lfo"]
    frequency: float
    min: float
    max: float
    target: Literal["filter.frequency", "osc1.detune", "osc2.detune", "amp.gain"]


class DistortionConfig(BaseModel):
    type: Literal["distortion"]
    amount: float


class ReverbConfig(BaseModel):
    type: Literal["reverb"]
    decay: float
    wet: float


class DelayConfig(BaseModel):
    type: Literal["delay"]
    time: float
    feedback: float
    wet: float
