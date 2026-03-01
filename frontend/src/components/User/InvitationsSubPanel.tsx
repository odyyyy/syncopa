import { Component, Show, For } from "solid-js";

type InvitationPanelProps = {
  incomeInvitations: Invitation[];
};

const InvitationsSubPanel: Component<InvitationPanelProps> = (props) => {
  return (
    <>
      <Show when={props.incomeInvitations?.length === 0}>
        <div class="flex-1 flex flex-col items-center justify-center mb-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 463 463"
            fill="currentColor"
            class="mb-5 opacity-75 w-50 h-50 animate-pulse"
          >
            <path d="m415 247.493-.004-4.024c-.01-9.833-4.708-19.233-12.567-25.144L375 197.698V15.5C375 6.953 368.047 0 359.5 0h-256C94.953 0 88 6.953 88 15.5v182.198l-27.429 20.627c-7.859 5.911-12.557 15.31-12.567 25.144L48 247.493v192.008c0 12.958 10.542 23.5 23.5 23.5h320c12.958 0 23.5-10.542 23.5-23.5zm-21.587-17.18a16.3 16.3 0 0 1 2.58 2.429L375 248.738v-32.271zM103.5 15h256a.5.5 0 0 1 .5.5v244.666l-13.047 9.941a7.499 7.499 0 0 0 4.551 13.466c1.584 0 3.182-.5 4.54-1.535L400 248.548v189.904l-83.967-63.974a7.5 7.5 0 0 0-9.091 11.931L387.781 448H75.219l131.736-100.37c14.452-11.011 34.639-11.01 49.089 0l26.948 20.532a7.5 7.5 0 0 0 9.091-11.931l-16.708-12.73 16.668-12.699a7.5 7.5 0 1 0-9.091-11.931l-20.013 15.248c-18.874-12.972-44.006-12.972-62.879 0l-52.005-39.623a7.5 7.5 0 0 0-9.091 11.931l48.66 37.074L63 438.452V248.548l51.961 39.59a7.47 7.47 0 0 0 4.54 1.535 7.5 7.5 0 0 0 4.551-13.466L103 260.166V15.5a.5.5 0 0 1 .5-.5M69.587 230.313 88 216.466v32.271l-20.993-15.995a16.4 16.4 0 0 1 2.58-2.429" />
            <path d="M305.534 311.093a7.49 7.49 0 0 0 5.971 2.955c1.584 0 3.182-.5 4.54-1.535l16.002-12.192a7.5 7.5 0 0 0-9.091-11.931l-16.002 12.192a7.5 7.5 0 0 0-1.42 10.511M171.5 263c19.907 0 35.5-12.08 35.5-27.5 0-.85-.055-1.688-.148-2.516A7.6 7.6 0 0 0 207 231.5v-82.343l97-27.714v59.476c-5.756-3.107-12.802-4.919-20.5-4.919-19.907 0-35.5 12.08-35.5 27.5s15.593 27.5 35.5 27.5 35.5-12.08 35.5-27.5c0-.85-.055-1.688-.148-2.516A7.6 7.6 0 0 0 319 199.5v-98.788c0-7.441-3.407-14.28-9.348-18.761s-13.45-5.88-20.608-3.835l-74.198 21.2C201.395 103.159 192 115.614 192 129.604v83.316c-5.756-3.107-12.802-4.919-20.5-4.919-19.907 0-35.5 12.08-35.5 27.5S151.593 263 171.5 263m112-47c-9.696 0-20.5-5.134-20.5-12.5s10.804-12.5 20.5-12.5 20.5 5.134 20.5 12.5-10.804 12.5-20.5 12.5m-64.533-102.262 74.197-21.2c2.586-.738 5.305-.234 7.454 1.387S304 98.02 304 100.712v5.131l-97 27.714v-3.953c0-7.329 4.921-13.853 11.967-15.866M171.5 223c9.696 0 20.5 5.134 20.5 12.5S181.196 248 171.5 248s-20.5-5.134-20.5-12.5 10.804-12.5 20.5-12.5" />
          </svg>
          <p class="text-center text-lg opacity-65 font-bold">
            Пока приглашений нет
          </p>
        </div>
      </Show>

      <Show when={props.incomeInvitations?.length !== 0}>
        <ul class="list flex-col rounded-box  bg-base-200 mt-5 gap-2 ">
          <For each={props.incomeInvitations}>
            {(invite, index) => (
              <li class="list-row shadow-none border-red-700 flex items-center hover:scale-105 cursor-pointer duration-300 gap-3 p-3">
                <span class="text-xs font-mono w-6 text-center opacity-50">
                  #{index() + 1}
                </span>

                <div class="flex-1 min-w-0">
                  <div class="font-medium  truncate">{invite.projectTitle}</div>
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
    </>
  );
};

export default InvitationsSubPanel;