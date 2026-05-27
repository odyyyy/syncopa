import { Accessor, Component, Index, Show } from "solid-js";
import Pattern from "../Pattern/Pattern";
import { PatternType, RecordPreviewPattern } from "../../../types/daw.types";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { Track as TrackType } from "../../../types/daw.types";
import RecordingAudioPattern from "../Pattern/RecordingAudioPattern";
import { recordingAudioPatternPreview } from "@/store/recording.store";

type TrackProps = {
  track: Accessor<TrackType>;
  onClick?: () => void;
};

export const Track: Component<TrackProps> = (props) => {
  const { beatNumber, tactElementsNumber } = useTimelineContext();
  return (
    <div
      data-track-id={`${props.track().trackId}`}
      class="track"
      onClick={() => props.onClick?.()}
    >
      <Index each={Array.from({ length: tactElementsNumber() })}>
        {(_, index) => (
          <div class="tact">
            <Index each={Array.from({ length: beatNumber() })}>
              {(_, index) => <div class="tact-el"></div>}
            </Index>
          </div>
        )}
      </Index>

      <Index each={props.track().patterns}>
        {(pattern: Accessor<PatternType>) => (
          <Pattern pattern={pattern} trackId={props.track().trackId} />
        )}
      </Index>
      <Show
        when={
          props.track().presetId === -1 &&
          recordingAudioPatternPreview() &&
          recordingAudioPatternPreview()?.trackId === props.track().trackId
        }
      >
        <RecordingAudioPattern
          recordPattern={
            recordingAudioPatternPreview as Accessor<RecordPreviewPattern>
          }
        />
      </Show>
    </div>
  );
};
