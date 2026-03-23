import { A } from "@solidjs/router";
import { Component } from "solid-js";
import logo from "../assets/imgs/logo.svg";

const Landing: Component = () => {
  return (
    <div
      data-theme="luxury"
      class="min-h-screen bg-base-100 flex flex-col selection:bg-primary selection:text-primary-content scroll-smooth"
    >
      <nav class="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <div class="text-2xl font-bold tracking-tighter font-['SyncopaLogoFont'] text-white">
          <img src={logo} alt="Logo" class="h-1 w-1 fill-amber-50" />
        </div>
        <div class="flex gap-8 text-sm uppercase tracking-widest font-light text-white/70">
          <A
            href="/projects"
            class="text-primary font-bold hover:scale-105 duration-200"
          >
            {/*Launch App*/}
          </A>
        </div>
      </nav>

      <main class="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom">
          <div class="w-[661.13px] h-[661.13px] top-[798.94px] absolute  left-1/2 transform -translate-x-1/2  bg-base-content blur-[342px]"></div>

          <div class="w-3.5 animate-pulse duration-10000 transition-all h-3.5 left-88.5 top-[463.50px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="fill-stone-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-5 h-5 animate-pulse duration-10000 transition-all left-[133.50px] top-[679.50px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="fill-stone-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-5 h-5 animate-pulse duration-10000 transition-all right-[133.50px] top-[709.50px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="fill-stone-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-14 h-14 animate-pulse duration-10000 transition-all left-[666px] top-[1075px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-7 h-7 left-[611.94px] animate-pulse duration-10000 transition-all top-[171px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="fill-stone-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-4 h-4 left-[122.09px] animate-pulse duration-10000 transition-all top-[130.09px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-4 h-4 left-[1012.09px] animate-pulse duration-10000 transition-all top-[600.09px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="fill-stone-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-7 h-7 left-[1245px] animate-pulse duration-10000 transition-all top-[396px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              class="fill-stone-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
          <div class="w-3.5 h-3.5 left-[1170.84px] animate-pulse duration-10000 transition-all top-[205px] absolute overflow-hidden">
            <div class="w-3.5 h-3.5 left-0 top-0 absolute ">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
              </svg>
            </div>
          </div>
          <div class="w-3.5 h-3.5 left-[1653px] top-[898px] absolute overflow-hidden">
            <div class="w-3.5 h-3.5 left-0 top-0 absolute bg-stone-300"></div>
          </div>
          <div class="w-3.5 h-3.5 left-[483px] top-[628px] absolute overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.719 6.279v1.17c0 .98-.39 1.82-1.08 2.31-.43.32-.96.47-1.51.47-.34 0-.68-.05-1.03-.17l-5.38-1.79v9.73c0 2.62-2.13 4.75-4.75 4.75s-4.75-2.13-4.75-4.75 2.13-4.75 4.75-4.75c1.26 0 2.4.5 3.25 1.3V3.999c0-.97.4-1.81 1.09-2.31.69-.49 1.61-.6 2.53-.3l4.42 1.48c1.36.45 2.46 1.98 2.46 3.41" />
            </svg>
          </div>
        </div>

        <div class="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl">
          <div class="mb-4 overflow-hidden">
            <h1
              class="text-7xl md:text-[160px] p-4 duration-300 text-base-content  font-black  font-['SyncopaLogoFont']
                       leading-normal drop-shadow-2xl opacity-0 animate-fade-in-up hover:scale-105"
            >
              Syncopa#
            </h1>
          </div>
          {/*
          <p
            class="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl
                    font-['SyncopaFontNormal'] leading-relaxed opacity-0 animate-fade-in-up delay-200"
          >
            <span class="text-stone-300 font-light"> Fast. Minimalist. Real-time DAW</span>{" "}
          </p>*/}
          {/*<span class="text-rotate text-7xl leading-[2]">
            <span class="justify-items-center">
              <span>📐 DESIGN</span>
              <span>⌨️ DEVELOP</span>
              <span>🌎 DEPLOY</span>
              <span>🌱 SCALE</span>
              <span>🔧 MAINTAIN</span>
              <span>♻️ REPEAT</span>
            </span>
          </span>*/}

          <A href="projects/" class="opacity-0 animate-fade-in-up delay-500">
            <button
              class="group relative px-8 py-4 mt-12  bg-primary text-primary-content    rounded-full
                           text-xl overflow-hidden transition-all cursor-pointer
                           hover:scale-103 duration-250 active:scale-95 hover:shadow-[0_0_40px_rgba(var(--p),0.4)]"
            >
              <div class="flex items-center gap-3 relative z-10 font-bold  tracking-wider">
                <span>Начать работу</span>
              </div>
            </button>
          </A>
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-base-100 border-t border-white/5 py-12 px-10">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <aside class="text-center md:text-left">
            <h2 class="text-xl font-bold  mb-2">Syncopa#</h2>
            <p class="text-sm text-zinc-500 uppercase tracking-widest">
              Copyright © 2026 - All rights reserved
            </p>
          </aside>

          <nav class="flex gap-6">
            <a
              href="https://github.com/odyyyy/syncopa"
              class="btn btn-ghost btn-circle hover:text-primary transition-all flex p-1.5"
            >
              <svg
                class="fill-current"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.976 0A7.977 7.977 0 0 0 0 7.976c0 3.522 2.3 6.507 5.431 7.584.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076-.343-.93-.881-1.175-.881-1.175-.734-.489.048-.489.048-.489.783.049 1.224.832 1.224.832.734 1.223 1.859.88 2.3.685.048-.538.293-.88.489-1.076-1.762-.196-3.621-.881-3.621-3.964 0-.88.293-1.566.832-2.153-.05-.147-.343-.978.098-2.055 0 0 .685-.196 2.201.832.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832.44 1.077.146 1.908.097 2.104a3.16 3.16 0 0 1 .832 2.153c0 3.083-1.86 3.719-3.62 3.915.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.98 7.98 0 0 0 16 7.976C15.951 3.572 12.38 0 7.976 0"
                />
              </svg>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
