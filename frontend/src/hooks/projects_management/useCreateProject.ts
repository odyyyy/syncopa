import { createSignal, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { fetchSearchUsersByUsername } from "../../api/user.api";
import { createFieldHandler } from "../shared";
import { debounce } from "@solid-primitives/scheduled";
import toast from "solid-toast";
import { useProjectsApi } from "../../api/projects-management.api";

export default function useCreateProject(
  onProjectCreated: (project: ProjectItemProps) => void,
) {
  const [projectData, setProjectData] = createStore<ProjectCreate>({
    title: "",
    invitedMembers: [],
  });
  const [rawQuery, setRawQuery] = createSignal("");
  const [query, setQuery] = createSignal("");
  const [members, setMembers] = createSignal<string[]>([]);

  const handleFieldInput = createFieldHandler(setProjectData);

  const { createProject } = useProjectsApi();
  const handleCreateProject = async () => {
    const response = await createProject(projectData);
    if (response.type === "success") {
      if (members().length > 0) {
        toast.success(
          "Проект успешно создан! \n\n Приглашения отправлены участникам",
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

  const addMember = (memberUsername: string) => {
    setMembers([...members(), memberUsername]);
  };

  const removeMember = (memberUsername: string) => {
    setMembers(members().filter((username) => username !== memberUsername));
  };

  const debounced = debounce((value: string) => {
    setQuery(value);
  }, 400);

  const [matchedUsers] = createResource<User[], string>(query, async (q) => {
    if (!q.trim()) return [];

    const res = await fetchSearchUsersByUsername(q);

    if (res.type === "success") {
      return res.data;
    }

    return [];
  });

  return {
    setRawQuery,
    debounced,
    matchedUsers,
    handleFieldInput,
    members,
    setMembers,
    addMember,
    removeMember,
    setProjectData,
    handleCreateProject,
    projectData,
  };
}
