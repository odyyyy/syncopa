import {
  createContext,
  createResource,
  createSignal,
  Match,
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
import SyncopaLoader from "../../components/utils/SyncopaLoading";
import { useProjectContext } from "../../hooks/daw/context/useProjectContext";
import { audioEngine } from "../../instruments/audioEngine";
import { createPolySynth } from "../../instruments/synths/createSynth";
import * as Tone from "tone";

export const PresetsContext = createContext<PresetsContextType>();

export const PresetsProvider: ParentComponent = (props) => {
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

  const { setTracks } = useProjectContext();
  const [presetModalState, setPresetModalState] =
    createSignal<PresetModalState>({ trackId: undefined, presetId: undefined });

  const { setInstrument } = audioEngine;
  const { getPresetConfigById } = useDawApi();
  const setAndLoadSelectedPreset = async (presetId: number) => {
    if (!presetId) return;

    const targetTrackId = presetModalState().trackId;
    if (!targetTrackId) return;

    const presetConfig = await getPresetConfigById(presetId);
    if (presetConfig.type === "error") {
      toast.error("Ошибка загрузки пресета");
      return;
    }
    
    
    if (presetConfig.data.type === "synth") {
      const synth = createPolySynth(presetConfig.data.config as Synth);
      
      setInstrument(targetTrackId, synth);
    } else if (presetConfig.data.type === "sampler") {
      setInstrument(
        targetTrackId,
        new Tone.Sampler((presetConfig.data.config as Sampler).samples_urls),
      );
    }

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
