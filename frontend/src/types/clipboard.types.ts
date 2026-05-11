import { Accessor, Setter } from "solid-js";
import { PatternVST } from "./daw.types";

type ClipboardBuffer = PatternVST | undefined;

type ClipboardContextType = { 
  clipboard: Accessor<ClipboardBuffer>;
  setClipboard: Setter<ClipboardBuffer>;
};

export type { ClipboardBuffer, ClipboardContextType };
