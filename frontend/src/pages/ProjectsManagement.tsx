import { Component, createResource, For, Show } from "solid-js";
import ProjectItemCard from "../components/ProjectsManagement/ProjectItemCard";
import ProjectCreatePopup from "../components/ProjectsManagement/ProjectCreateItem";
import UserPanel from "../components/User/UserPanel";
import { useProjectsApi } from "../api/projects-management.api";
import { userData } from "../store/user";

const ProjectsManagement: Component = () => {
  const { getProjectsList } = useProjectsApi();
  const [projects, { mutate }] = createResource<ProjectItemProps[]>(
    async () => {
      const res = await getProjectsList();

      return res.type === "success" ? res.data : [];
    },
  );

  const handleAddNewProject = (project: ProjectItemProps) => {
    mutate((prev) => [project, ...(prev ?? [])]);
  };

  const handleRemoveProject = (id: string) => {
    mutate((prev) => prev?.filter((p) => p.id !== id) ?? []);
  };

  return (
    <div class="bg-bg">
      <UserPanel />
      <div class="p-4">
        <main class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 max-w-8xl mx-auto">
          <For each={projects()}>
            {(project) => (
                <ProjectItemCard
                  id={project.id}
                  title={project.title}
                  modifiedAt={
                    project.modifiedAt
                      ? new Date(project.modifiedAt)
                          .toLocaleString()
                          .replace(/,/g, "\u00A0\u00A0")
                          .slice(0, -3)
                      : "Неизвестно"
                  }
                  invitedMembers={[
                    {
                      username: userData.username,
                      avatar: userData.avatar,
                    },
                    ...project.invitedMembers,
                  ]}
                  onRemove={handleRemoveProject}
                />
            )}
          </For>
          <ProjectCreatePopup onCreate={handleAddNewProject} />
        </main>
      </div>
    </div>
  );
};

export default ProjectsManagement;
