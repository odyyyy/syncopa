import { useProjectContext } from "../context/useProjectContext";

const usePresetManage = () => {
  const { setTracks } = useProjectContext();

  const updatePreset = async (
    presetId: number,
    trackId: string,
    setAndLoadSelectedPreset: (pid: number, tid: string) => Promise<void>,
    setPresetModalState: any
  ) => {
    await setAndLoadSelectedPreset(presetId, trackId);
    setTracks((t) => t.trackId === trackId, "presetId", presetId);
    setPresetModalState((s: any) => ({
      ...s,
      presetId,
    }));
  };

  return { updatePreset };
};

export default usePresetManage;