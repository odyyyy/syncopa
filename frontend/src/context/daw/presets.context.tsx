import {
  createContext,
  createResource,
  createSignal,
  Match,
  onMount,
  ParentComponent,
  Switch,
  useContext,
} from "solid-js";
import {
  Preset,
  PresetModalState,
  PresetsContextType,
  Sampler,
  Synth,
} from "../../types/presets.types";
import toast from "solid-toast";
import useDawApi from "../../api/daw.api";
import SyncopaLoader from "../../components/utils/Loaders/SyncopaLoading";
import { useProjectContext } from "../../hooks/daw/context/useProjectContext";
import { audioEngine } from "../../instruments/audioEngine";
import { createPolySynth } from "../../instruments/createSynth";
import * as Tone from "tone";
import { getSamplesBasePath } from "../../config/config";

export const PresetsContext = createContext<PresetsContextType>();

export const PresetsProvider: ParentComponent = (props) => {
  const [isPresetLoading, setIsPresetLoading] = createSignal(false);

  const { getPresetsCatalog } = useDawApi();
  const [presets] = createResource<Preset[] | null>(async () => {
    const res = await getPresetsCatalog();
    if (res.type === "success") {
      return res.data;
    } else if (res.type === "error") {
      toast.error("Ошибка загрузки пресетов.\nПерезагрузите страницу");
      return null;
    }
    return null;
  });

  const { getUsedInProjectPresetsConfigs } = useDawApi();
  const { tracks } = useProjectContext();
  onMount(async () => {
    if (tracks.length === 0) return;

    const usedPresetsIds = tracks.flatMap((track) => {
      const instrument = audioEngine.getInstrument(track.trackId);
      const needsLoading = track.presetId && !instrument;
      return needsLoading ? [track.presetId] : [];
    });

    if (usedPresetsIds.length === 0) return;

    const res = await getUsedInProjectPresetsConfigs(usedPresetsIds);
    if (res.type === "success") {
      tracks.forEach((track) => {
        const preset = res.data[track.presetId];
        if (preset && preset.type === "synth") {
          const synth = createPolySynth(preset.config as Synth);
          audioEngine.setInstrument(track.trackId, synth);
        } else if (preset && preset.type === "sampler") {
          audioEngine.setInstrument(
            track.trackId,
            new Tone.Sampler(preset.config as Sampler),
          );
        }
      });
    } else if (res.type === "error") {
      toast.error("Ошибка загрузки пресетов.\nПерезагрузите страницу");
    }
  });

  const { setTracks } = useProjectContext();
  const [presetModalState, setPresetModalState] =
    createSignal<PresetModalState>({ trackId: undefined, presetId: undefined });

  const { getPresetConfigById } = useDawApi();

  const setAndLoadSelectedPreset = async (
    presetId: number,
    targetTrackId: string,
  ) => {
    const presetConfig = await getPresetConfigById(presetId);
    if (presetConfig.type === "error") {
      toast.error("Ошибка загрузки пресета");
      throw new Error("Ошибка загрузки пресета");
    }

    if (presetConfig.data.type === "synth") {
      const synth = createPolySynth(presetConfig.data.config as Synth);

      audioEngine.setInstrument(targetTrackId, synth);
      setIsPresetLoading(false);
    } else if (presetConfig.data.type === "sampler") {
      const samplesUrls = (presetConfig.data.config as Sampler).samplesUrls;
      const samplesDir = (presetConfig.data.config as Sampler).samplesDir;

      const sampler = new Tone.Sampler({
        urls: Object.fromEntries(
          Object.entries(samplesUrls).map(([note, path]) => [
            note,
            `${getSamplesBasePath()}/${samplesDir}/${path}`,
          ]),
        ),
        onload: () => {
          audioEngine.setInstrument(targetTrackId, sampler);
          setIsPresetLoading(false);
        },
        onerror: () => {
          toast.error("Не удалось загрузить пресет");
          setIsPresetLoading(false);
          return;
        },
      });
    }
  };

  const setAndLoadSelectedPresetInModal = async (presetId: number) => {
    if (!presetId) return;

    const targetTrackId = presetModalState().trackId;
    if (!targetTrackId) return;

    await setAndLoadSelectedPreset(presetId, targetTrackId);

    setTracks((t) => t.trackId === targetTrackId, "presetId", presetId);
    setPresetModalState((s) => ({
      ...s,
      presetId,
    }));
  };

  return (
    <Switch>
      <Match when={presets.loading}>
        <SyncopaLoader />
      </Match>
      <Match when={presets()}>
        <PresetsContext.Provider
          value={{
            presets: presets() ?? [],
            presetModalState,
            setPresetModalState,
            setAndLoadSelectedPreset,
            setAndLoadSelectedPresetInModal,
            isPresetLoading,
            setIsPresetLoading,
          }}
        >
          {props.children}
        </PresetsContext.Provider>
      </Match>
    </Switch>
  );
};

export const usePresetsContext = () => {
  const context = useContext(PresetsContext);
  if (!context) {
    throw new Error("PresetsContext не найден");
  }
  return context;
};
