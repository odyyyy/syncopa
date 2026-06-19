import { usePlayerContext } from "@/context/daw/player.context";
import { useTimelineContext } from "@/context/daw/timeline.context";
import {
  recordingAudioPatternPreview,
  setRecordingAudioPatternPreview,
} from "@/store/recording.store";
import { createSignal } from "solid-js";
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

    try {
      if (Tone.context.lookAhead > 0.03) {
        Tone.context.lookAhead = 0.01;
      }
      await Tone.start();
    } catch (e) {
      toast.error("Не удалось запустить аудио-движок");
      return;
    }

    const audioInputDevice = new Tone.UserMedia();
    const rec = new Tone.Recorder();
    audioInputDevice.connect(rec);

    try {
      await audioInputDevice.open({
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        latency: 0,
      } as any);

      const synth = new Tone.MembraneSynth().toDestination();
      const beatInterval = 0.5;
      const beatCount = 4;
      const startTime = Tone.now();

      for (let i = 0; i < beatCount; i++) {
        synth.triggerAttackRelease("C5", "16n", startTime + i * beatInterval);
      }

      const recordAtToneTime = startTime + beatCount * beatInterval;

      Tone.Draw.schedule(() => {
        synth.dispose();
        rec.start();
        setIsRecording(true);
        setRecorder(rec);

        toast.success("Запись началась!");

        setRecordingAudioPatternPreview({
          trackId: selectedTrackIdToRecord()!,
          pos: playerBeatPos(),
          width: 0,
        });
      }, recordAtToneTime);
    } catch (error) {
      audioInputDevice.dispose();
      rec.dispose();
      toast.error(
        "Для начала записи Вы должны дать разрешение на использование аудио-устройства на данной странице",
        { duration: 5000 },
      );
    }
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
