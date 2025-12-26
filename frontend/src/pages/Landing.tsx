import landingMainPic from "../assets/imgs/landing-picture.jpg";
import { A } from "@solidjs/router";
import { Component } from "solid-js";

const Landing: Component = () => {
  return (
    <main class="relative h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <div
        class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform ease-in-out duration-1000 hover:scale-102"
        style={{ "background-image": `url(${landingMainPic})` }}
      >
        <div class="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center text-center px-4">
        <h1 class="md:text-[150px]  font-bold  tracking-tight font-['SyncopaLogoFont'] bg-[linear-gradient(to_right,#E9E9E9_52%,#A2A2A2_72%)] bg-clip-text text-transparent">
          Syncopa
        </h1>

        <p class="text-lg md:text-[28px] text-[#A4A4A4] font-light mb-6  font-['SyncopaFontNormal']">
          Fast minimalist real-time collaborative DAW
        </p>
        <A href="app/">
          <button class="btn flex text-2xl items-center gap-2 bg-black hover:bg-zinc-900 border-none text-white px-6 py-7 rounded-xl transition-all active:scale-95 shadow-2xl font-['SyncopaFont'] ">
            <span class="px-1">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9983 0.810453C9.59829 1.27267 6.63162 1.70601 6.43162 1.79268C6.09829 1.87934 5.99829 3.46823 5.99829 8.40823C5.99829 13.2327 5.89829 14.966 5.59829 15.1105C5.36496 15.2549 4.36496 15.4282 3.33162 15.5438C1.96496 15.7171 1.29829 15.9482 0.764956 16.526C-1.66838 18.9527 2.16496 21.7838 5.79829 20.2816C7.86496 19.4438 7.99829 18.8949 7.99829 12.2505V6.35712L12.765 5.72156C15.365 5.34601 17.8316 4.99934 18.265 4.91268L18.9983 4.76823V8.95712C18.9983 11.9616 18.8983 13.2327 18.5983 13.3771C18.365 13.5216 17.365 13.6949 16.3316 13.8105C14.2316 14.0705 12.9983 14.9949 12.9983 16.3816C12.9983 19.2127 17.9983 19.8771 20.2983 17.3638C20.9983 16.6127 20.9983 16.3527 20.9316 8.32156L20.8316 0.0593415L19.9983 0.00156371C19.5316 -0.0273252 16.3983 0.34823 12.9983 0.810453Z"
                  fill="white"
                />
              </svg>
            </span>
            <span class="font-medium  font-['SyncopaFontNormal']">Lets do music!</span>
          </button>
        </A>
      </div>
    </main>
  );
};

export default Landing;
