import { RecordPreviewPattern } from "@/types/daw.types";
import { createSignal } from "solid-js";

const [recordingAudioPatternPreview, setRecordingAudioPatternPreview] =
  createSignal<RecordPreviewPattern | null>(null);

export {
  recordingAudioPatternPreview, setRecordingAudioPatternPreview
}