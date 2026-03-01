import {
  Component,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";

import DeleteModal from "../utils/ConfirmActionModal";
import { useProjectsApi } from "../../api/projects-management.api";
import toast from "solid-toast";

type ContextMenuProps = {
  children: JSX.Element;
  project_id: string;
  onRemove?: (id: string) => void;
};

const ProjectItemContextMenu: Component<ContextMenuProps> = (
  props: ContextMenuProps,
) => {
  const [openContextMenu, setOpenContextMenu] = createSignal(false);
  const [deleteOpen, setDeleteOpen] = createSignal(false);

  let triggerRef: HTMLDivElement | undefined;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      openContextMenu() &&
      triggerRef &&
      !triggerRef.contains(event.target as Node)
    ) {
      setOpenContextMenu(false);
    }
  };

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpenContextMenu(false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleEsc);
  });
  const { deleteProject } = useProjectsApi();
  const handleDeleteProject = async (project_id: string) => {
    const res = await deleteProject(project_id);
    if (res.type === "success") {
      toast.success(`Проект ${res.data.title} успешно удален`);
      props.onRemove?.(props.project_id);
    } else {
      toast.error("Ошибка при удалении проекта");
    }
    return res;
  };

  return (
    <div class="relative ">
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpenContextMenu(!openContextMenu());
        }}
      >
        {props.children}
      </div>
      <Show when={openContextMenu()}>
        <ul class="menu bg-base-200 absolute z-50 rounded-xl w-51  right-0 ">
          <li>
            <a>
              <svg
                fill="currentColor"
                width="800px"
                height="800px"
                class="h-5 w-5"
                viewBox="0 0 36 36"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  class="clr-i-solid clr-i-solid-path-1"
                  d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"
                ></path>
                <path
                  class="clr-i-solid clr-i-solid-path-2"
                  d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"
                ></path>
                <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
              </svg>
              Изменить название
            </a>
          </li>

          <li class="rounded-4xl" onclick={() => setDeleteOpen(true)}>
            <p class="text-red-700">
              <svg
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m8 22.1a1.4 1.4 0 0 1-2 2l-6-6-6 6.02a1.4 1.4 0 1 1-2-2l6-6.04-6.17-6.22a1.4 1.4 0 1 1 2-2L18 16.1l6.17-6.17a1.4 1.4 0 1 1 2 2L20 18.08Z"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
              Удалить
            </p>
          </li>
        </ul>
      </Show>
      <DeleteModal
        title="Удалить проект?"
        open={deleteOpen()}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          handleDeleteProject(props.project_id);
          setOpenContextMenu(false);
        }}
      />
    </div>
  );
};

export default ProjectItemContextMenu;
