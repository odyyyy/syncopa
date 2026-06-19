import toast from "solid-toast";
import { usePresetsContext } from "../../context/daw/presets.context";
import { Track } from "../../types/daw.types";
import { useProjectContext } from "@/context/daw/project.context";
import { volumeToDb } from "../../context/daw/player.context";
import { audioEngine } from "../../instruments/audioEngine";
import { PolySynthInstance } from "../../types/presets.types";
import * as Tone from "tone";
import { createSignal } from "solid-js";
import { InstrumentTypeEnum } from "@/components/DAW/Track/TrackInstrumentChooseModal";
import {generateUUID} from "@/config/config"

const useTracksManager = () => {
  const { setAndLoadSelectedPreset } = usePresetsContext();
  const { tracks, setTracks } = useProjectContext();
  const [isMuted, setIsMuted] = createSignal(false);
  
  const addNewTrack = (
    title: string | undefined = undefined,
    presetCategory: string,
  ) => {
    if (tracks.length > 50) {
      toast.error("Максимальное количество дорожек достигнуто");
      return;
    }
  
    if (!title) {
      title = generateTrackTitle(tracks);
    }
  
    const trackId = generateUUID();
    const presetId = getDefaultPresetIdByCategory(presetCategory);
    const newTrack = {
      trackId: trackId,
      presetId: presetId,
      title: title,
      patterns: [],
      volume: 50,
    };
  
    addTrackInStoreAndLoadDefaultPreset(newTrack);
  
    return newTrack;
  };

  const addTrackInStoreAndLoadDefaultPreset = (track: Track) => {
    if (tracks.some((t) => t.trackId === track.trackId)) {
      return;
    }

    setTracks((prev) => [...prev, track]);

    if (track.presetId !== -1) {
      setAndLoadSelectedPreset(track.presetId, track.trackId);
    }
  };

  const getDefaultPresetIdByCategory = (category: string): number => {
    switch (category) {
      case InstrumentTypeEnum.Synth:
        return 1;
      case InstrumentTypeEnum.Guitar:
        return 2;
      case InstrumentTypeEnum.Drum:
        return 3;
      case InstrumentTypeEnum.Audio:
        return -1;
      default:
        return 7;
    }
  };

  const removeTrackFromStore = (trackId: string) => {
    setTracks((prev: Track[]) => prev.filter((t) => t.trackId !== trackId));
  };

  const handleTrackVolumeChange = (newVolume: number, trackId: string) => {
    const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
    const track = tracks.at(trackIndex);

    setTracks(trackIndex, (prev) => ({
      ...prev,
      volume: newVolume,
    }));

    if (track?.presetId === -1) {
      track.patterns?.forEach((pattern) => {
        const patternAudioPlayer = audioEngine.getAudioPlayer(
          pattern.patternId,
        );
        if (patternAudioPlayer) {
          patternAudioPlayer.volume.value = volumeToDb(newVolume);
        }
      });
    } else {
      const preset = audioEngine.getInstrument(trackId);
      if (preset && (preset as PolySynthInstance).type === "polySynth") {
        (preset as PolySynthInstance).setVolume(newVolume / 100);
      }
      if (preset instanceof Tone.Sampler) {
        (preset as Tone.Sampler).volume.value = volumeToDb(newVolume);
      }
    }
  };

  return {
    addNewTrack,
    addTrackInStoreAndLoadDefaultPreset,
    getDefaultPresetIdByCategory,
    handleTrackVolumeChange,
    removeTrackFromStore,
    isMuted,
    setIsMuted,
  };
};

export default useTracksManager;

const generateTrackTitle = (tracks: Track[]) => {
  const used = new Set(
    tracks
      .map((t) => t.title.match(/^Дорожка (\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number),
  );
  let i = 1;
  while (used.has(i)) i++;
  return `Дорожка ${i}`;
};
