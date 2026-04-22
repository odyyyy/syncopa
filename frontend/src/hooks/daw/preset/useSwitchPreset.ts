import { usePresetsContext } from "../../../context/daw/presets.context";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";


const useSwitchPreset = () => {
  const { updatePreset, presetModalState } = usePresetsContext();
  const { sendChangeEvent } = useSendChangeEvent();

  const selectPresetFromModal = async (presetId: number) => {
    const targetTrackId = presetModalState().trackId;
    if (!presetId || !targetTrackId) return;

    updatePreset(presetId, targetTrackId);

    sendChangeEvent(SyncOperation.UPDATE, Target.PRESET, {
      presetId,
      trackId: targetTrackId,
    });
  };

  return { selectPresetFromModal };
};

export default useSwitchPreset;
