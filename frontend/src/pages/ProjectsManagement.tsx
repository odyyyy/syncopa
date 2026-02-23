import {
  Component,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import ProjectItemCard from "../components/ProjectsManagement/ProjectItemCard";
import ComponentLoading from "../components/utils/ComponentLoading";
import ThemeController from "../components/utils/ThemeController";
import ProjectCreatePopup from "../components/ProjectsManagement/ProjectCreatePopup";
import LogoutModal from "../components/ProjectsManagement/LogoutModal";
import { useAuth } from "../hooks/auth/useAuth";
import { userData } from "../store/user";

const ProjectsManagement: Component = () => {
  // Получение данных

  // const projectsList = createResource(fetchProjectsList);
  const projectsList = [{}];

  const username = userData.username;
  const avatar = userData.avatar;

  const [openSidebar, setOpenSidebar] = createSignal(false);
  const [logoutOpen, setLogoutOpen] = createSignal(false);

  const { logout } = useAuth();

  let sidebarRef: HTMLDivElement | undefined;

  onMount(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSidebar(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        openSidebar() &&
        sidebarRef &&
        !sidebarRef.contains(e.target as Node)
      ) {
        setOpenSidebar(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);

    onCleanup(() => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  return (
    <div class="bg-bg">
      {/* Navbar */}
      <div class="navbar bg-base-100 shadow-sm relative z-40">
        <div class="navbar-start">
          <button
            class="btn btn-ghost btn-circle"
            onClick={() => setOpenSidebar(!openSidebar())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>

        <div class="navbar-center" />

        <div class="navbar-end">
          <ThemeController />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        class={`
                  fixed top-0 left-0 h-full w-72 bg-base-200 shadow-xl
                  transform transition-transform duration-300 ease-in-out z-50
                  ${openSidebar() ? "translate-x-0" : "-translate-x-full"}
                `}
      >
        <div class="p-3 flex flex-col h-full">
          <div class="flex items-center justify-between pb-3 border-b border-base-300">
            <div class="flex items-center gap-2">
              <Show when={!avatar}>
                <div class="avatar avatar-placeholder">
                  <div class="bg-neutral text-neutral-content w-12 rounded-full">
                    <span>{username.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </Show>

              <Show when={avatar}>
                <div class="avatar">
                  <div class="w-12 rounded-full">
                    <img src={avatar} />
                  </div>
                </div>
              </Show>

              <div
                class="font-semibold text-base-content max-w-[160px] truncate cursor-default"
                title={username}
              >
                {username}
              </div>
            </div>

            <button
              class="btn btn-ghost btn-sm btn-circle "
              onClick={() => setOpenSidebar(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu */}
          <ul class="menu mt-4 flex-1 text-base-content p-0 ">
            <li>
              <a class="pl-1 hover:bg-base-300 rounded-lg ">
                Настройки аккаунта
              </a>
            </li>
            <li class="inline-flex">
              <a
                class="pl-1 text-error hover:bg-error/10 rounded-lg inline-flex"
                onClick={() => setLogoutOpen(true)}
              >
                Выйти
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <LogoutModal
        open={logoutOpen()}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
      />

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
