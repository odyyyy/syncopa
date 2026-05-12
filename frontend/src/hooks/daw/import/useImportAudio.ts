import { createSignal } from "solid-js";
import { useProjectContext } from "@/context/daw/project.context";
import toast from "solid-toast";
import useDawApi from "../../../api/daw.api";
import { PatternAudio } from "../../../types/daw.types";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { usePlayerContext } from "@/context/daw/player.context";
import { audioEngine } from "@/instruments/audioEngine";
import useProjectManager from "../project/useProjectManager";

const useImportAudio = () => {
  const [importOpen, setImportOpen] = createSignal(false);
  const { setTracks, tracks } = useProjectContext();
  const { project } = useProjectContext();
  const { saveAudioPatternFile } = useDawApi();
  const { beatNumber } = useTimelineContext();
  const { bpm } = usePlayerContext();

  const addImportedAudioPatternInAudioTrack = async (
    file: File,
  ): Promise<
    | {
        audioPattern: PatternAudio;
        trackId: string;
      }
    | undefined
  > => {
    validateAudioFile(file);

    const trackIndex = tracks.findIndex((track) => track.presetId === -1);

    if (trackIndex === -1) {
      toast.error("Для импорта аудио должна быть хотя бы одна аудио-дорожка!");
      throw new Error(
        "Для импорта аудио должна быть хотя бы одна аудио-дорожка!",
      );
    }

    const audioPatternData = await saveAndAddAudioPattern(file, trackIndex);

    return {
      audioPattern: audioPatternData.audioPattern,
      trackId: audioPatternData.trackId,
    };
  };

  const saveAndAddAudioPattern = async (
    file: File,
    trackIndex: number | undefined = undefined,
  ) => {
    const buffer = await file.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buffer);

    const res = await saveAudioPatternFile(project()?.projectId!, file);

    if (res.type === "error") {
      toast.error(res.detail);
      throw new Error(res.detail);
    }

    const patternWidth = audioBuffer.duration / ((60 / bpm()) * beatNumber());
    const patternId = res.data.patternId;

    const audioPattern: PatternAudio = {
      type: "audio",
      patternId,
      title: file.name,
      pos: 0,
      width: patternWidth,
      audioMetadata: {
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channelsNumber: audioBuffer.numberOfChannels,
      },
    };

    const trackId = addAudioPatternOnTrack(audioPattern, trackIndex);
    if (!trackId) {
      toast.error("Ошибка при добавлении аудио на дорожку");
      throw new Error("Ошибка при добавлении аудио на дорожку");
    }
    audioEngine.addAudioPlayer(audioPattern.patternId, audioBuffer);

    return { audioPattern, trackId };
  };

  const addAudioPatternOnTrack = (
    audioPattern: PatternAudio,
    trackIdx: number | undefined = undefined,
  ) => {
    if (trackIdx === undefined) {
      trackIdx = tracks.findIndex((track) => track.presetId === -1);
    }
    if (trackIdx === -1) {
      return;
    }

    setTracks(trackIdx, "patterns", (prev) =>
      prev ? [...prev, audioPattern] : [audioPattern],
    );
    const track = tracks[trackIdx];
    if (!track) {
      return;
    }
    return track.trackId;
  };

  const { loadAudioPatternsUsedInProject } = useProjectManager();
  const syncImportedAudioPattern = (
    audioPattern: PatternAudio,
    trackId: string,
  ) => {
    loadAudioPatternsUsedInProject([audioPattern.patternId]);

    setTracks(
      (track) => track.trackId === trackId,
      "patterns",
      (prev = []) =>
        prev?.some((p) => p.patternId === audioPattern.patternId)
          ? prev
          : [...(prev ?? []), audioPattern],
    );
  };

  const validateAudioFile = (file: File) => {
    if (file.size > 1024 * 1024 * 5) {
      toast.error("Размер файла не должен превышать 5 МБ");
      throw new Error("Размер файла не должен превышать 5 МБ");
    }
    if (
      file.type !== "audio/wav" &&
      file.type !== "audio/mp3" &&
      file.type !== "audio/ogg"
    ) {
      toast.error("Файл должен быть в формате WAV, MP3 или OGG");
      throw new Error("Файл должен быть в формате WAV, MP3 или OGG");
    }
  };

  return {
    importOpen,
    setImportOpen,
    addImportedAudioPatternInAudioTrack,
    addAudioPatternOnTrack,
    syncImportedAudioPattern,
    saveAndAddAudioPattern,
  };
};

export default useImportAudio;
