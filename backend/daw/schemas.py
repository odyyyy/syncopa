from typing import Literal, Optional, Union

from pydantic import UUID4, Field

from projects_management.schemas import ProjectMember
from shared.base_schema import BaseSchema


class ProjectWithPayload(BaseSchema):
    project_id: UUID4
    title: str
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
    patterns: list[Union["PatternVST", "PatternAudio"]] | None = None


class Pattern(BaseSchema):
    pattern_id: str
    title: str
    pos: float
    width: float
    type: Literal["audio", "vst"]
    ref: str | None


class PatternVST(Pattern):
    instrument_id: str | None = None
    notes: list["Note"] = Field(default_factory=list)


class Note(BaseSchema):
    pos: float
    duration: float
    pitch: int
    velocity: float


class PatternAudio(Pattern):
    source: str
    audio_metadata: "AudioClipMetadata"


class AudioClipMetadata(BaseSchema):
    id: str
    title: str
    duration: float


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
                                "instrument_id": "piano-grand",
                                "notes": [
                                    {
                                        "pos": 0.0,
                                        "note": 60,
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
                                "source": "http://s3.syncopa.daw/....",
                                "audio_metadata": {
                                    "title": "audio clip",
                                    "duration": 30.5
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
