import { Accessor, Component } from "solid-js";
import { ContextMenuItems } from "../../types/daw.types";


const ContextMenu: Component<{
  menu: Accessor<ContextMenuItems | null>;
  setMenu: (menu: ContextMenuItems | null) => void;
  closeMenu: () => void;
}> = ({ menu, setMenu, closeMenu }) => {
  if (!menu) return null;

  return (
    <div>
      <ul
        onContextMenu={(e) => e.preventDefault()}
        style={{
          left: `${menu()?.x}px`,
          top: `${menu()?.y}px`,
        }}
        tabIndex={-1}
        class="rounded-2xl menu bg-base-200 z-500 fixed w-40 p-2 shadow-sm"
      >
        {menu()!.items.map((item) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              item.onClick?.();
              closeMenu();
            }}
          >
            <a>{item.label}</a>
          </li>
        ))}
      </ul>

      <div class="absolute top-40 inset-0 z-499" onClick={closeMenu} onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setMenu({
          x: e.clientX,
          y: e.clientY,
          items: menu()!.items,
        })
      }} />
    </div>
  );
};

export default ContextMenu;
