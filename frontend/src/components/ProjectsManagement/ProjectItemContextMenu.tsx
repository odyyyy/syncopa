import {
  Component,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";

type ContextMenuProps = {
  children: JSX.Element;
};

const ProjectItemContextMenu: Component<ContextMenuProps> = (
  props: ContextMenuProps,
) => {
  const [openContextMenu, setOpenContextMenu] = createSignal(false);

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
                version="1.1"
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
    
          <li class="rounded-4xl">
            <p class="text-red-700">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Удалить
            </p>
          </li>
        </ul>
      </Show>
    </div>
  );
};

export default ProjectItemContextMenu;
