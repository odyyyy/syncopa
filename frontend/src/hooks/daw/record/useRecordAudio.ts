import { usePlayerContext } from "@/context/daw/player.context";
import { useTimelineContext } from "@/context/daw/timeline.context";
import {
  recordingAudioPatternPreview,
  setRecordingAudioPatternPreview,
} from "@/store/recording";
import { createEffect, createSignal } from "solid-js";
import toast from "solid-toast";
import * as Tone from "tone";
import useImportAudio from "../import/useImportAudio";
import { useProjectContext } from "@/context/daw/project.context";
import { useSendChangeEvent } from "@/coop/handleCoopEvents";
import { SyncOperation, Target } from "@/types/coop.types";

const useRecordAudio = () => {
  const [isRecording, setIsRecording] = createSignal(false);
  const [selectedTrackIdToRecord, setSelectedTrackIdToRecord] = createSignal<
    string | null
  >(null);

  const [recorder, setRecorder] = createSignal<Tone.Recorder | null>(null);

  const { sendChangeEvent } = useSendChangeEvent();

  const { playerBeatPos } = usePlayerContext();
  const startRecording = async () => {
    if (!selectedTrackIdToRecord()) {
      toast.error("Выберите аудио-дорожку для записи");
      return;
    }
    const audioInputDevice = new Tone.UserMedia();
    const rec = new Tone.Recorder();
    audioInputDevice.connect(rec);
    await audioInputDevice
      .open()
      .then(function () {
        setIsRecording(true);
        rec.start();
        setRecorder(rec);
        toast.success("Запись началась!");
        setRecordingAudioPatternPreview({
          trackId: selectedTrackIdToRecord()!,
          pos: playerBeatPos(),
          width: 0,
        });
      })
      .catch(() => {
        toast.error(
          "Для начала записи Вы должны дать разрешение на использование аудио-устройства на данной странице",
          {
            duration: 5000,
          },
        );
      });
  };

  const { saveAndAddAudioPattern } = useImportAudio();
  const { tracks } = useProjectContext();
  const stopRecording = async () => {
    if (!isRecording() || !recorder()) {
      return;
    }
    const recordedBlob = await recorder()?.stop();
    if (!recordedBlob) {
      toast.error("Ошибка при сохранении записи");
      return;
    }

    const now = new Date();
    const recordDate = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;

    const audioFile = new File([recordedBlob], `Запись ${recordDate}.wav`, {
      type: "audio/wav",
    });

    const trackIndex = tracks.findIndex(
      (track) => track.trackId === recordingAudioPatternPreview()?.trackId,
    );

    if (trackIndex === -1) {
      toast.error(
        "Для размещения записанного аудио должна быть хотя бы одна аудио-дорожка!",
      );
      throw new Error(
        "Для размещения записанного аудио должна быть хотя бы одна аудио-дорожка!",
      );
    }

    const savedAudioPattern = await saveAndAddAudioPattern(
      audioFile,
      trackIndex,
    );
    if (!savedAudioPattern) {
      toast.error("Ошибка при сохранении аудио-паттерна");
      throw new Error("Ошибка при сохранении аудио-паттерна");
    }
    sendChangeEvent(SyncOperation.CREATE, Target.PATTERN, {
      type: "audio",
      audioPattern: savedAudioPattern.audioPattern,
      trackId: savedAudioPattern.trackId,
    });

    setRecordingAudioPatternPreview(null);
    setSelectedTrackIdToRecord(null);
    setIsRecording(false);
    setRecorder(null);

    toast.success("Запись остановлена!");
  };

  return {
    selectedTrackIdToRecord,
    setSelectedTrackIdToRecord,
    startRecording,
    isRecording,
    stopRecording,
    saveAndAddAudioPattern,
  };
};

export default useRecordAudio;
