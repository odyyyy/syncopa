import { createStore } from "solid-js/store";
import { createFieldHandler } from "../shared";
import toast from "solid-toast";
import { useProjectsApi } from "../../api/projects-management.api";

export default function useCreateProject(
  onProjectCreated: (project: ProjectItemProps) => void,
  setMembers: (members: string[]) => void,
) {
  const [projectData, setProjectData] = createStore<ProjectCreate>({
    title: "",
    invitedMembers: [],
  });

  const handleFieldInput = createFieldHandler(setProjectData);

  const { createProject } = useProjectsApi();
  const handleCreateProject = async (members: string[]) => {
    const response = await createProject(projectData);
    if (response.type === "success") {
      if (members.length > 0) {
        toast.success(
          "Проект успешно создан!\nПриглашения отправлены участникам.",
          { duration: 3500 },
        );
      } else {
        toast.success("Проект успешно создан!");
      }
      const newProject: ProjectItemProps = {
        id: response.data.id,
        title: response.data.title,
        modifiedAt: response.data.modifiedAt,
        invitedMembers: response.data.invitedMembers || [],
      };

      onProjectCreated(newProject);
    } else {
      toast.error("Ошибка при создании проекта. Попробуйте снова");
    }
    setProjectData({ title: "", invitedMembers: [] });
    setMembers([]);
  };

  return {
    handleFieldInput,
    setProjectData,
    handleCreateProject,
    projectData,
  };
}
