import { createSignal, onCleanup, onMount } from "solid-js";

const CoopCursor = () => {
  const [cursorPosition, setCursorPosition] = createSignal({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    let x = e.clientX;
    let y = e.clientY;
    
    const cursorWidth = 24; 
    const cursorHeight = 24;
    const cursorPadding = 5;
    
    const maxX = window.innerWidth - cursorWidth - cursorPadding;
    const maxY = window.innerHeight - cursorHeight - cursorPadding;
    
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    
    // setCursorPosition({ x, y });
  };

  onMount(() => {
    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      handleMouseMove({ clientX: cursorPosition().x, clientY: cursorPosition().y } as MouseEvent);
    });
  });

  onCleanup(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", () => {});
  });

  return (
    <div
      class="absolute z-500"
      style={{ top: `${cursorPosition().y}px`, left: `${cursorPosition().x}px` }}
    >
      <svg
        width="800"
        height="800"
        viewBox="0 0 24 24"
        class="h-6 w-6 rotate-340"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fill-rule="evenodd">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035q-.016-.005-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427q-.004-.016-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093q.019.005.029-.008l.004-.014-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014-.034.614q.001.018.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
          <path
            d="M6.682 3.396a1.088 1.088 0 0 1 1.807-.745l9.951 8.827c.724.642.312 1.84-.655 1.9l-3.117.191 2.092 4.999a2 2 0 0 1-1.062 2.612l-.868.37a2 2 0 0 1-2.626-1.061l-2.226-5.262-2.323 2.007c-.73.63-1.858.07-1.797-.892z"
            fill="white"
          />
        </g>
      </svg>
    </div>
  );
};

export default CoopCursor;
