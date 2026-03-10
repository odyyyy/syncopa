
import { useContext } from "solid-js";
import { TracksContext } from "../../../context/daw/tracks.context";

export function useTracksContext()  {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error("TracksContext не найден");
  }
  return context;
}
