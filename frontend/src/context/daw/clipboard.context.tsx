
import {
  createContext,
  ParentComponent,
  createSignal,
  useContext,
} from "solid-js";
import { ClipboardBuffer, ClipboardContextType } from "../../types/clipboard.types";

const ClipboardContext = createContext<ClipboardContextType>();

export const ClipboardProvider: ParentComponent = (props) => {
  const [clipboard, setClipboard] = createSignal<ClipboardBuffer>();

  return (
    <ClipboardContext.Provider
      value={{
        clipboard,
        setClipboard,
      }}
    >
      {props.children}
    </ClipboardContext.Provider>
  );
};

export function useClipboardContext() {
  const context = useContext(ClipboardContext);
  if (!context) {
    throw new Error("ClipboardContext не найден");
  }
  return context;
}
