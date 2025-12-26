import { Component } from "solid-js/types/server/rendering.js";

const NotFound404: Component = () => {
  return (
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform ease-in-out duration-1000 hover:scale-102">
      <div class="flex flex-col self-center justify-center">
        <img src="" alt="Страница не найдена" />
        <h1 class="text-3xl md:text-5xl font-['BaseTextCyrillicFont']">Страница не найдена</h1>
        <button class="btn btn-accent mt-10 ">Home</button>
      </div>
    </div>
  );
};

export default NotFound404;
