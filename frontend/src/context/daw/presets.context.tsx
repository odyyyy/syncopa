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
  PresetConfig,
  PresetModalState,
  PresetsContextType,
  Sampler,
  SamplerWithUrls,
  Synth,
} from "../../types/presets.types";
import toast from "solid-toast";
import useDawApi from "../../api/daw.api";
import SyncopaLoader from "../../components/utils/Loaders/SyncopaLoading";
import { useProjectContext } from "@/context/daw/project.context";
import { audioEngine } from "../../instruments/audioEngine";
import { createPolySynth } from "../../instruments/createSynth";
import * as Tone from "tone";
import { getSamplesBasePath } from "../../config/config";
import usePresetManage from "../../hooks/daw/preset/usePresetManage";

export const PresetsContext = createContext<PresetsContextType>();

export const PresetsProvider: ParentComponent = (props) => {
  const [isPresetLoading, setIsPresetLoading] = createSignal(false);
  const [presetModalState, setPresetModalState] =
    createSignal<PresetModalState>({ trackId: undefined, presetId: undefined });

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

        if (!preset) return;
        setPresets(preset, track.trackId);
      });
    } else if (res.type === "error") {
      toast.error("Ошибка загрузки пресетов.\nПерезагрузите страницу");
    }
  });

  const { getPresetConfigById } = useDawApi();

  const setPresets = (presetConfig: PresetConfig, targetTrackId: string) => {
    if (presetConfig.type === "synth") {
      const synth = createPolySynth(presetConfig.config as Synth);
      synth.config = presetConfig.config as Synth;

      audioEngine.setInstrument(targetTrackId, synth);
    } else if (presetConfig.type === "sampler") {
      const samplesUrls = (presetConfig.config as Sampler).samplesUrls;
      const samplesDir = (presetConfig.config as Sampler).samplesDir;
      const urls = Object.fromEntries(
        Object.entries(samplesUrls).map(([note, path]) => [
          note,
          `${getSamplesBasePath()}/${samplesDir}/${path}`,
        ]),
      );
      const sampler = new Tone.Sampler({
        urls: urls,
        onload: () => {
          sampler.samplesUrls = urls;
          audioEngine.setInstrument(targetTrackId, sampler);
        },
        onerror: () => {
          toast.error("Не удалось загрузить пресет");
        },
      }) as SamplerWithUrls;
    }
  };

  const setAndLoadSelectedPreset = async (
    presetId: number,
    targetTrackId: string,
  ) => {
    const presetConfig = await getPresetConfigById(presetId);
    if (presetConfig.type === "error") {
      toast.error("Ошибка загрузки пресета");
      setIsPresetLoading(false);
      throw new Error("Ошибка загрузки пресета");
    }
    setPresets(presetConfig.data, targetTrackId);
    setIsPresetLoading(false);
  };

  const { updatePreset: internalUpdate } = usePresetManage();
  const updatePreset = async (presetId: number, trackId: string) => {
    await internalUpdate(
      presetId,
      trackId,
      setAndLoadSelectedPreset,
      setPresetModalState,
    );
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
            isPresetLoading,
            setIsPresetLoading,
            updatePreset,
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
