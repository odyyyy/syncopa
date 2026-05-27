import {
  Component,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { userData } from "../../store/user.store";
import ThemeController from "../utils/ThemeController";
import LogoutModal from "../utils/ConfirmActionModal";
import UserAccountSettings from "./UserAccountSettings";
import { useInvitationsApi } from "../../api/user.api";
import InvitationsPanel from "./InvitationsPanel";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import AvatarDefault from "./Avatars/AvatarDefault";
import AvatarPicture from "./Avatars/AvatarPicture";

const UserPanel: Component<{ handleNewProjectOnInviteAccept: (project: ProjectItemProps) => void }> = (props) => {
  const [openSidebar, setOpenSidebar] = createSignal(false);
  const [settingsOpen, setSettingsOpen] = createSignal(false);
  const [logoutOpen, setLogoutOpen] = createSignal(false);

  const { logout } = useAuthContext();

  const { getInvitationsList } = useInvitationsApi();
  const [incomeInvitations, { mutate }] = createResource<Invitation[]>(async () => {
    const res = await getInvitationsList();
    return res.type === "success" ? res.data : [];
  });
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
    <>
      {/* Navbar */}

      <div class="navbar bg-base-100 shadow-sm relative z-40">
        <div class="navbar-start">
          <div class="indicator">
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
            <Show when={incomeInvitations()?.length !== 0}>
              <span class="status mt-2 -ml-1 bg-base-content z-100"></span>
            </Show>
          </div>
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
            <div
              class="flex items-center gap-2 cursor-pointer"
              onclick={() => {
                setSettingsOpen(true);
                setOpenSidebar(false);
              }}
            >
              <Show when={!userData.avatar}>
                <AvatarDefault username={userData.username} size={12} />
               
              </Show>

              <Show when={userData.avatar}>
                <AvatarPicture src={userData.avatar} username={userData.username} size={12} />
              </Show>

              <div
                class="font-semibold text-base max-w-40 truncate cursor-pointer"
                title={userData.username}
              >
                {userData.username}
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

          <div class="flex flex-col h-full">
            <ul class="menu mt-2 text-base-content  flex-none gap-1 -ml-2 border-b border-base-300 w-full">
              <li>
                <a
                  class="pl-1 text-base hover:bg-base-300 rounded-lg"
                  onclick={() => {
                    setSettingsOpen(true);
                    setOpenSidebar(false);
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4a1 1 0 0 0-1 1c0 1.692-2.046 2.54-3.243 1.343a1 1 0 1 0-1.414 1.414C7.54 8.954 6.693 11 5 11a1 1 0 1 0 0 2c1.692 0 2.54 2.046 1.343 3.243a1 1 0 0 0 1.414 1.414C8.954 16.46 11 17.307 11 19a1 1 0 1 0 2 0c0-1.692 2.046-2.54 3.243-1.343a1 1 0 1 0 1.414-1.414C16.46 15.046 17.307 13 19 13a1 1 0 1 0 0-2c-1.692 0-2.54-2.046-1.343-3.243a1 1 0 0 0-1.414-1.414C15.046 7.54 13 6.693 13 5a1 1 0 0 0-1-1m-2.992.777a3 3 0 0 1 5.984 0 3 3 0 0 1 4.23 4.231 3 3 0 0 1 .001 5.984 3 3 0 0 1-4.231 4.23 3 3 0 0 1-5.984 0 3 3 0 0 1-4.231-4.23 3 3 0 0 1 0-5.984 3 3 0 0 1 4.231-4.231"
                      fill="currentColor"
                    />
                    <path
                      d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-2.828-.828a4 4 0 1 1 5.656 5.656 4 4 0 0 1-5.656-5.656"
                      fill="currentColor"
                    />
                  </svg>
                  Настройки аккаунта
                </a>
              </li>
              <li class="inline-flex text-error">
                <a
                  class="pl-1 mb-2   hover:bg-error/10 text-base rounded-lg inline-flex"
                  onClick={() => setLogoutOpen(true)}
                >
                  <svg
                    class="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5 3-3m0 0-3-3m3 3H9" />
                    </g>
                    <defs>
                      <clipPath id="a">
                        <path fill="#fff" d="M0 .001h24v24H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                  Выйти
                </a>
              </li>
            </ul>
            <InvitationsPanel
              updateInvitationPanel={mutate}
              handleNewProjectOnInviteAccept={props.handleNewProjectOnInviteAccept}
              incomeInvitations={incomeInvitations ?? []}
            />
          </div>
        </div>
      </aside>

      <UserAccountSettings
        open={settingsOpen()}
        onClose={() => setSettingsOpen(false)}
      />

      <LogoutModal
        title="Выйти из аккаунта?"
        open={logoutOpen()}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
      />
    </>
  );
};

export default UserPanel;
