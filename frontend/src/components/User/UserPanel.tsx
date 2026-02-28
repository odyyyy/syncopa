import {
  Component,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { useAuth } from "../../hooks/auth/useAuth";
import { userData } from "../../store/user";
import ThemeController from "../utils/ThemeController";
import LogoutModal from "../utils/ConfirmActionModal";
import UserAccountSettings from "./UserAccountSettings";
import { useInvitationsApi } from "../../api/user.api";

const UserPanel: Component = () => {
  const { id, username, avatar, email } = userData;

  const [openSidebar, setOpenSidebar] = createSignal(false);
  const [settingsOpen, setSettingsOpen] = createSignal(false);
  const [logoutOpen, setLogoutOpen] = createSignal(false);

  const { logout } = useAuth();

  const { getInvitationsList } = useInvitationsApi();
  const [incomeInvitations] = createResource<Invitation[]>(async () => {
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
                class="font-semibold text-base max-w-40 truncate cursor-default"
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

          <div class="flex flex-col h-full">
            <ul class="menu mt-4 text-base-content flex-none p-0 border-b border-base-300 w-full">
              <li>
                <a
                  class="pl-1 text-base hover:bg-base-300 rounded-lg"
                  onclick={() => {
                    setSettingsOpen(true);
                    setOpenSidebar(false);
                  }}
                >
                  Настройки аккаунта
                </a>
              </li>
              <li class="inline-flex">
                <a
                  class="pl-1 text-error hover:bg-error/10 text-base rounded-lg inline-flex"
                  onClick={() => setLogoutOpen(true)}
                >
                  Выйти
                </a>
              </li>
            </ul>
            <Show when={incomeInvitations()?.length === 0}>
              <div class="flex-1 flex flex-col items-center justify-center mb-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 463 463"
                  fill="currentColor"
                  class="mb-5 opacity-65 w-50 h-50 animate-pulse"
                >
                  <path d="m415 247.493-.004-4.024c-.01-9.833-4.708-19.233-12.567-25.144L375 197.698V15.5C375 6.953 368.047 0 359.5 0h-256C94.953 0 88 6.953 88 15.5v182.198l-27.429 20.627c-7.859 5.911-12.557 15.31-12.567 25.144L48 247.493v192.008c0 12.958 10.542 23.5 23.5 23.5h320c12.958 0 23.5-10.542 23.5-23.5zm-21.587-17.18a16.3 16.3 0 0 1 2.58 2.429L375 248.738v-32.271zM103.5 15h256a.5.5 0 0 1 .5.5v244.666l-13.047 9.941a7.499 7.499 0 0 0 4.551 13.466c1.584 0 3.182-.5 4.54-1.535L400 248.548v189.904l-83.967-63.974a7.5 7.5 0 0 0-9.091 11.931L387.781 448H75.219l131.736-100.37c14.452-11.011 34.639-11.01 49.089 0l26.948 20.532a7.5 7.5 0 0 0 9.091-11.931l-16.708-12.73 16.668-12.699a7.5 7.5 0 1 0-9.091-11.931l-20.013 15.248c-18.874-12.972-44.006-12.972-62.879 0l-52.005-39.623a7.5 7.5 0 0 0-9.091 11.931l48.66 37.074L63 438.452V248.548l51.961 39.59a7.47 7.47 0 0 0 4.54 1.535 7.5 7.5 0 0 0 4.551-13.466L103 260.166V15.5a.5.5 0 0 1 .5-.5M69.587 230.313 88 216.466v32.271l-20.993-15.995a16.4 16.4 0 0 1 2.58-2.429" />
                  <path d="M305.534 311.093a7.49 7.49 0 0 0 5.971 2.955c1.584 0 3.182-.5 4.54-1.535l16.002-12.192a7.5 7.5 0 0 0-9.091-11.931l-16.002 12.192a7.5 7.5 0 0 0-1.42 10.511M171.5 263c19.907 0 35.5-12.08 35.5-27.5 0-.85-.055-1.688-.148-2.516A7.6 7.6 0 0 0 207 231.5v-82.343l97-27.714v59.476c-5.756-3.107-12.802-4.919-20.5-4.919-19.907 0-35.5 12.08-35.5 27.5s15.593 27.5 35.5 27.5 35.5-12.08 35.5-27.5c0-.85-.055-1.688-.148-2.516A7.6 7.6 0 0 0 319 199.5v-98.788c0-7.441-3.407-14.28-9.348-18.761s-13.45-5.88-20.608-3.835l-74.198 21.2C201.395 103.159 192 115.614 192 129.604v83.316c-5.756-3.107-12.802-4.919-20.5-4.919-19.907 0-35.5 12.08-35.5 27.5S151.593 263 171.5 263m112-47c-9.696 0-20.5-5.134-20.5-12.5s10.804-12.5 20.5-12.5 20.5 5.134 20.5 12.5-10.804 12.5-20.5 12.5m-64.533-102.262 74.197-21.2c2.586-.738 5.305-.234 7.454 1.387S304 98.02 304 100.712v5.131l-97 27.714v-3.953c0-7.329 4.921-13.853 11.967-15.866M171.5 223c9.696 0 20.5 5.134 20.5 12.5S181.196 248 171.5 248s-20.5-5.134-20.5-12.5 10.804-12.5 20.5-12.5" />
                </svg>
                <p class="text-center text-lg opacity-65 font-bold">
                  Пока приглашений нет
                </p>
              </div>
            </Show>

            <Show when={incomeInvitations()?.length !== 0}>
              <ul class="list flex-col rounded-box  bg-base-200 mt-5 gap-2 ">
                <For each={incomeInvitations()}>
                  {(invite, index) => (
                    <li class="list-row shadow-none border-red-700 flex items-center hover:scale-105 cursor-pointer duration-300 gap-3 p-3">
                      <span class="text-xs font-mono w-6 text-center opacity-50">
                        #{index() + 1}
                      </span>

                      <div class="flex-1 min-w-0">
                        <div class="font-medium  truncate">
                          {invite.projectTitle}
                        </div>
                        <div class="text-xs opacity-60">
                          от {invite.senderUsername}
                        </div>
                      </div>

                      <div class="flex gap-0.5">
                        <button class="btn btn-xs btn-square btn-ghost text-success">
                          ✓
                        </button>
                        <button class="btn btn-xs btn-square btn-ghost text-error">
                          ✕
                        </button>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>
        </div>
      </aside>

      <UserAccountSettings
        open={settingsOpen()}
        onClose={() => setSettingsOpen(false)}
        id={id}
        avatar={avatar}
        username={username}
        email={email}
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
