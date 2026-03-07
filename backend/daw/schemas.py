from typing import Literal, Optional

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
    tracks: list["Track"]  = []


class PayloadMetadata(BaseSchema):
    total_volume: int = Field(..., ge=0, le=100)


class Track(BaseSchema):
    track_id: int
    title: str
    volume: int = Field(..., ge=0, le=100)
    patterns: list["Pattern"] | None


class Pattern(BaseSchema):
    pattern_id: int
    pos: int
    type: Literal["audio", "vst"]
    ref: str | None


class PatternVST(Pattern):
    instrument_id: str
    notes: list["Note"] | None


class Note(BaseSchema):
    pos: float
    duration: float
    pitch: int
    velocity: float


class PatternAudio(Pattern):
    source: str
    audio_metadata: "AudioClipMetadata"


class AudioClipMetadata(BaseSchema):
    title: str
    duration: float


"""
    ProjectWithPayload JSON Examples:
        {
            "project_id": "",
            "payload": {
                "metadata": {
                    "total_volume": 50
                },
                "tracks": [
                    {
                        "track_id": 0,
                        "title": "Track 1",
                        "volume": 33,
                        "patterns": [
                            # Pattern with VST instrument
                            {
                                "pattern_id": 0,
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
                                "pattern_id": 1,
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
                        "track_id": 1,
                        "title": "",
                        "volume": 34,
                        "patterns": []
                    }
                ]
            }
        }
"""
