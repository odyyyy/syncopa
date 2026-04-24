import toast from "solid-toast";
import { usePresetsContext } from "../../context/daw/presets.context";
import { Track } from "../../types/daw.types";
import { useProjectContext } from "@/context/daw/project.context";
import { volumeToDb } from "../../context/daw/player.context";
import { audioEngine } from "../../instruments/audioEngine";
import { PolySynthInstance } from "../../types/presets.types";
import * as Tone from "tone";
import { PRESETS_CATEGORIES_ENUM } from "../../components/DAW/Preset/PresetChooseModal";

const useTracksManager = () => {
  const { setAndLoadSelectedPreset } = usePresetsContext();
  const { tracks, setTracks } = useProjectContext();
  

  const addNewTrack = (
    title: string | undefined = undefined,
    presetCategory: string,
  ) => {
    if (tracks.length > 50) {
      toast.error("Максимальное количество дорожек достигнуто");
      return;
    }

    if (!title) {
      title = `Дорожка ${tracks.length + 1}`;
    }

    const trackId = crypto.randomUUID();
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
    setTracks((prev: Track[]) => [...prev, track]);
    if (track.presetId === 0) return;
    setAndLoadSelectedPreset(track.presetId, track.trackId);
  };

  const getDefaultPresetIdByCategory = (category: string): number => {
    switch (category) {
      case PRESETS_CATEGORIES_ENUM.LEAD:
        return 6;
      case PRESETS_CATEGORIES_ENUM.TUBE:
        return 7;
      case PRESETS_CATEGORIES_ENUM.GUITAR:
        return 8;
      case PRESETS_CATEGORIES_ENUM.DRUM:
        return 9;
      case PRESETS_CATEGORIES_ENUM.KEY:
        return 10;
      default:
        return 0;
    }
  };

  const removeTrackFromStore = (trackId: string) => {
    setTracks((prev: Track[]) => prev.filter((t) => t.trackId !== trackId));
  };

    const handleTrackVolumeChange = (
      newVolume: number,
      trackId: string,
    ) => {
      const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
  
      setTracks(trackIndex, (prev) => ({
        ...prev,
        volume: newVolume,
      }));
  
      const preset = audioEngine.getInstrument(trackId);
      if (preset && (preset as PolySynthInstance).type === "polySynth") {
        (preset as PolySynthInstance).setVolume(newVolume / 100);
      }
      if (preset instanceof Tone.Sampler) {
        (preset as Tone.Sampler).volume.value = volumeToDb(newVolume);
      }
    };

  return {
    addNewTrack,
    addTrackInStoreAndLoadDefaultPreset,
    getDefaultPresetIdByCategory,
    handleTrackVolumeChange,
    removeTrackFromStore,
  };
};

export default useTracksManager;
