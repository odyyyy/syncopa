import { VersionMetadata } from "@/types/vcs.types";
import { Component, For, Show, createMemo } from "solid-js";

interface VCSWholeProjectHistoryProps {
  branches: string[];
  versionsRecord: Record<string, VersionMetadata[]>;
  selectedVersion: () => VersionMetadata | null;
  setSelectedVersion: (v: VersionMetadata | null) => void;
}

const VCSWholeProjectHistory: Component<VCSWholeProjectHistoryProps> = (
  props,
) => {
  const getBranchColor = (branchName: string) => {
    const hash = branchName
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
  };

  const processGraph = (
    versionsMap: Record<string, VersionMetadata[]>,
    branches: string[],
  ) => {
    const allVersions: Record<
      string,
      VersionMetadata & { x: number; y: number; branchName: string }
    > = {};
    const branchOffsets: Record<string, number> = {};

    branches.forEach((name, index) => {
      branchOffsets[name] = index;
    });

    const sortedGlobal = Object.entries(versionsMap)
      .flatMap(([branchName, vs]) => vs.map((v) => ({ ...v, branchName })))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const timeMap = new Map<string, number>();
    let timeStep = 0;

    sortedGlobal.forEach((v) => {
      if (!timeMap.has(v.id)) {
        timeMap.set(v.id, timeStep++);
      }

      if (!allVersions[v.id]) {
        allVersions[v.id] = {
          ...v,
          x: branchOffsets[v.branchName] ?? 0,
          y: timeMap.get(v.id)!,
        };
      }
    });

    return Object.values(allVersions);
  };

  const NODE_STEP_Y = 100;
  const NODE_STEP_X = 60; // 400
  const OFFSET_X = 40;

  const graphData = createMemo(() =>
    processGraph(props.versionsRecord, props.branches),
  );

  const renderConnections = () => {
    return (
      <svg
        class="absolute inset-0 pointer-events-none"
        style={{
          width: "100%",
          height: `${(graphData().length + 1) * NODE_STEP_Y}px`,
        }}
      >
        <For each={graphData()}>
          {(version) => (
            <For each={version.parentsIds || []}>
              {(parentId) => {
                const parent = graphData().find((v) => v.id === parentId);
                if (!parent) return null;

                const x1 = OFFSET_X + parent.x * NODE_STEP_X;
                const y1 = parent.y * NODE_STEP_Y + 32;
                const x2 = OFFSET_X + version.x * NODE_STEP_X;
                const y2 = version.y * NODE_STEP_Y + 32;

                const d = `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;

                return (
                  <path
                    d={d}
                    stroke={getBranchColor(version.branchName)}
                    stroke-width="2"
                    fill="none"
                    class="opacity-40 transition-all"
                  />
                );
              }}
            </For>
          )}
        </For>
      </svg>
    );
  };

  return (
    <div class="flex-1 overflow-auto p-4 relative custom-scrollbar bg-base-200/30">
      <div
        class="relative min-w-max p-10"
        style={{ height: `${graphData().length * NODE_STEP_Y + 200}px` }}
      >
        {renderConnections()}

        <For each={graphData()}>
          {(version) => (
            <div
              style={{
                position: "absolute",
                left: `${OFFSET_X + version.x * NODE_STEP_X}px`,
                top: `${version.y * NODE_STEP_Y}px`,
                "z-index": 20,
              }}
              class="flex items-center group"
            >
              <div
                onClick={() => props.setSelectedVersion(version)}
                class={`size-5 rounded-full border-4 border-base-100 shadow-md cursor-pointer transition-all hover:scale-125 active:scale-95 ${
                  props.selectedVersion()?.id === version.id
                    ? "ring-4 ring-primary/30 scale-110"
                    : ""
                }`}
                style={{
                  "background-color": getBranchColor(version.branchName),
                }}
              ></div>

              <div
                onClick={() => props.setSelectedVersion(version)}
                class={`ml-1 w-64 p-3 rounded-xl border cursor-pointer transition-all backdrop-blur-md ${
                  props.selectedVersion()?.id === version.id
                    ? "bg-base-100 border-primary shadow-xl translate-x-1"
                    : "bg-base-100/60 border-neutral/10 hover:bg-base-100 hover:border-neutral/30 shadow-sm"
                }`}
              >
                <div class="flex justify-between items-start gap-2">
                  <span class="text-xs font-bold truncate leading-tight">
                    {version.message}
                  </span>
                  <span class="text-[9px] font-mono opacity-40 shrink-0">
                    {version.id.slice(0, 4)}
                  </span>
                </div>

                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center gap-1.5">
                    <div class="size-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <span class="text-[8px] font-black text-primary uppercase">
                        {version.creatorUsername.slice(0, 1)}
                      </span>
                    </div>
                    <span class="text-[9px] font-bold text-base-content/60 uppercase">
                      {version.creatorUsername}
                    </span>
                  </div>

                  <Show when={version.isHead}>
                    <span class="badge badge-primary badge-xs scale-75 origin-right">
                      HEAD: {version.branchName}
                    </span>
                  </Show>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default VCSWholeProjectHistory;
