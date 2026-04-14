import { Accessor, Component, For, Show } from "solid-js";
import { ContextMenuItems } from "../../types/daw.types";

const ContextMenu: Component<{
  menu: Accessor<ContextMenuItems | null>;
  setMenu: (menu: ContextMenuItems | null) => void;
  closeMenu: () => void;
}> = (props) => {
  return (
    <Show when={props.menu()}>
      {(m) => (
        <div class="relative transition-all duration-200">
          <div
            class="fixed inset-0 z-499 bg-transparent"
            onClick={props.closeMenu}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              props.setMenu({
                x: e.clientX,
                y: e.clientY,
                items: m().items,
              });
            }}
          />

          <ul
            onContextMenu={(e) => e.preventDefault()}
            style={{
              left: `${m().x}px`,
              top: `${m().y}px`,
            }}
            tabIndex={-1}
            class={`fixed z-500 min-w-50 p-1.5 shadow-2xl shadow-black/40
                   bg-base-200/80 backdrop-blur-xl border border-white/10
                   rounded-xl select-none outline-none animate-menu`}
          >
            <For each={m().items}>
              {(item) => (
                <li class="group">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick?.();
                      props.closeMenu();
                    }}
                    class="w-full flex items-center justify-between gap-4 px-3 py-2
                           rounded-lg transition-all duration-75
                           hover:bg-primary/20 hover:text-primary-content
                           cursor-pointer
                           active:scale-[0.97] group-active:bg-primary/30"
                  >
                    <div class="flex items-center gap-2.5">
                      <Show when={item.icon}>
                        <span class="text-base-content/50 group-hover:text-primary transition-colors">
                          {item.icon}
                        </span>
                      </Show>
                      <span class="text-[11px] font-bold uppercase tracking-tight opacity-90 group-hover:opacity-100">
                        {item.label}
                      </span>
                    </div>

                    <Show when={(item as any).shortcut}>
                      <span class="text-[9px] font-mono opacity-30 group-hover:opacity-60 uppercase tracking-widest">
                        {(item as any).shortcut}
                      </span>
                    </Show>
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
      )}
    </Show>
  );
};

export default ContextMenu;
