import { createContext, ParentComponent, createSignal } from "solid-js";
import { TracksContextType } from "../../types/daw.types";

export const TracksContext = createContext<TracksContextType>();

export const TracksProvider: ParentComponent = (props) => {
  const [tactElementsNumber, setTactElementsNumber] = createSignal(30);
  const [tactWidth, setTactWidth] = createSignal(180);
  const [beatNumber, setBeatNumber] = createSignal(4);

  return (
    <TracksContext.Provider
      value={{
        tactElementsNumber,
        setTactElementsNumber,
        tactWidth,
        setTactWidth,
        beatNumber,
        setBeatNumber,
      }}
    >
      {props.children}
    </TracksContext.Provider>
  );
};
