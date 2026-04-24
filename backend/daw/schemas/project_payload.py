from typing import Literal, Optional, Union

from pydantic import UUID4, Field

from projects_management.schemas import ProjectMember
from shared.base_schema import BaseSchema


class ProjectWithPayload(BaseSchema):
    project_id: UUID4
    title: str
    owner_id: UUID4
    invited_members: list[ProjectMember]
    payload: Optional["ProjectPayload"]


class ProjectPayload(BaseSchema):
    metadata: Optional["PayloadMetadata"]
    tracks: list["Track"] = []


class PayloadMetadata(BaseSchema):
    bpm: int = 120
    total_volume: int = Field(..., ge=0, le=100)


class Track(BaseSchema):
    track_id: str
    title: str
    volume: int = Field(..., ge=0, le=100)
    preset_id: int
    patterns: list[Union["PatternVST", "PatternAudio"]] | None = None


class Pattern(BaseSchema):
    pattern_id: str
    title: str
    pos: float
    width: float
    type: Literal["audio", "vst"]


class PatternVST(Pattern):
    notes: list["Note"] = Field(default_factory=list)


class Note(BaseSchema):
    note_id: str
    pos: float
    note: str
    duration: float
    velocity: float = Field(default=1.0, ge=0, le=1.0)


class PatternAudio(Pattern):
    audio_metadata: "AudioClipMetadata"


class AudioClipMetadata(BaseSchema):
    duration: float
    sample_rate: int
    channels_number: int = Field(default=1, ge=1, le=2)


class PatternAudioOut(BaseSchema):
    pattern_id: str


"""
    ProjectWithPayload JSON Examples:
        {
            "project_id": "",
            "payload": {
                "metadata": {
                    "total_volume": 50
                    "bpm": 120
                },
                "tracks": [
                    {
                        "track_id": "c6b4e3fd-f003-43e8-bc93-a90919a0ef65",
                        "title": "Track 1",
                        "volume": 33,
                        "patterns": [
                            # Pattern with VST instrument
                            {
                                "pattern_id": "a88514cb-2bb3-4dcb-a5af-1499b79f7d8a",
                                "pos": 0,
                                "type": "vst",
                                "preset_id": 3,
                                "notes": [
                                    {
                                        "pos": 0.0,
                                        "note": "C4",
                                        "duration": 1.0,
                                        "velocity": 1.0
                                    }
                                ],
                                "ref": null
                            },
                            # Pattern with audio clip
                            {
                                "pattern_id": "b88514cb-2bb3-4dcb-a5af-1499b79f7d8a",
                                "pos": 0,
                                "type": "audio",
                                "title": "Title",
                                "source": "http://s3.syncopa.daw/....",
                                "audio_metadata": {
                                    "duration": 30.5,
                                    "sample_rate": 44100,
                                    "channels_number": 2
                                },
                                "ref": null
                            }
                        ]
                    },
                    {
                        "track_id": "32b1c0d5-681e-41b1-b639-b45c601ba06a",
                        "title": "Track N",
                        "volume": 34,
                        "patterns": []
                    }
                ]
            }
        }
"""
