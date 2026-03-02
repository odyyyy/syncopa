import { A } from "@solidjs/router";
import { Component } from "solid-js";

const NotFound404: Component = () => {
  return (
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div class="flex flex-col items-center justify-center h-h-full gap-2">
        <h1 class="text-8xl decoration-amber-50 animate-bounce">404</h1>
        <h2 class="text-2xl decoration-amber-50">Страница не найдена :(</h2>
        <img />
        <A href="/projects">
          <button class="btn btn-primary p-5 m-5 rounded-xl">Главная</button>
        </A>
      </div>
    </div>
  );
};

export default NotFound404;
