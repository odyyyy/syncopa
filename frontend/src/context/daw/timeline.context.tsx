import { createContext, ParentComponent, createSignal, useContext } from "solid-js";
import { TimelineContextType } from "../../types/daw.types";

const TimelineContext = createContext<TimelineContextType>();

export const TimelineProvider: ParentComponent = (props) => {
  const [tactElementsNumber, setTactElementsNumber] = createSignal(30); // 225
  const [tactWidth, setTactWidth] = createSignal(180);
  const [beatNumber, setBeatNumber] = createSignal(4);

  return (
    <TimelineContext.Provider
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
    </TimelineContext.Provider>
  );
};

export function useTimelineContext()  {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("TimelineContext не найден");
  }
  return context;
}
