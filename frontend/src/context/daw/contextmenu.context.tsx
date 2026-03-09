import {
  createContext,
  createSignal,
  ParentComponent,
  Show,
  useContext,
  onMount,
  onCleanup,
} from "solid-js";
import ContextMenu from "../../components/DAW/ContextMenu";
import {
  ContextMenuItems,
  ContextMenuProviderType,
} from "../../types/daw.types";

const ContextMenuContext = createContext<ContextMenuProviderType>();

export const ContextMenuProvider: ParentComponent = (props) => {
  const [menu, setMenu] = createSignal<ContextMenuItems | null>(null);

  const openMenu = (x: number, y: number, items: any[]) => {
    setMenu({ x, y, items });
  };

  const closeMenu = () => {
    setMenu(null);
  };

  return (
    <ContextMenuContext.Provider value={{ openMenu, closeMenu }}>
      {props.children}

      <Show when={menu()}>
        {(menuData) => (
          <ContextMenu menu={menuData} setMenu={setMenu} closeMenu={closeMenu} />
        )}
      </Show>
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("ContextMenuContext не найден");
  }
  return context;
};