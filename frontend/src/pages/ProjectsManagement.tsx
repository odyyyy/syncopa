import { Component, createResource, Show } from "solid-js";
import ProjectItemCard from "../components/ProjectsManagement/ProjectItemCard";
import ComponentLoading from "../components/utils/ComponentLoading";
import ProjectCreatePopup from "../components/ProjectsManagement/ProjectCreatePopup";
import UserPanel from "../components/User/UserPanel";

const ProjectsManagement: Component = () => {
  // const projectsList = createResource(fetchProjectsList);
  const projectsList = [{}];

  return (
    <div class="bg-bg">
      <UserPanel />

      <div class="p-4">
        {/* Контент */}
        <main class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 max-w-8xl mx-auto">
          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={true}
            />
          </Show>
          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={false}
            />
          </Show>
          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={true}
            />
          </Show>
          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={true}
            />
          </Show>
          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={true}
            />
          </Show>
          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={true}
            />
          </Show>
          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={true}
            />
          </Show>

          <Show when={projectsList} fallback=<ComponentLoading />>
            <ProjectItemCard
              name="Midnight Synthwave"
              updatedAt="20.11.2025"
              bpm={128}
              isFavorite={true}
            />
          </Show>

          <ProjectCreatePopup />
        </main>
      </div>
    </div>
  );
};

export default ProjectsManagement;
