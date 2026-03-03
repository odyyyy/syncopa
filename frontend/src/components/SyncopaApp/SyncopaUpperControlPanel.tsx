import { Component } from "solid-js";
import ThemeController from "../utils/ThemeController";

const SyncopaUpperControlPanel: Component = () => {
  return (
    <nav class="navbar bg-base-200 p-2 shadow-sm relative z-40 shrink-0">
      <div class="navbar-start gap-1">
        {/*<h2>Projectasdasdsd</h2>*/}
        <div class="dropdown dropdown-hover">
          <div tabindex="0" role="button" class="btn-main m-1 p-2">
            Проект
          </div>
          <ul
            tabindex="-1"
            class="dropdown-content rounded-2xl menu bg-base-200 z-1 w-40 p-2 shadow-sm"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>

        {/* Undo */}
        <button class="btn-main">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
          >
            <path
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 9v5h5m11 2c-.497-4.5-3.367-8-8-8-2.73 0-5.929 2.268-7.294 5.5"
            />
          </svg>
        </button>
        {/* Redo  */}
        <button class="btn-main">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 rotate-y-180"
            fill="none"
          >
            <path
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 9v5h5m11 2c-.497-4.5-3.367-8-8-8-2.73 0-5.929 2.268-7.294 5.5"
            />
          </svg>
        </button>
      </div>

      <div class="navbar-center">
        <ul class="menu menu-horizontal bg-base-200 rounded-box">
          {/* Backward */}
          <li>
            <a>
              <svg
                fill="currentColor"
                stroke="currentColor"
                class="w-5 h-5"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M236 70.653v114.694a16 16 0 0 1-24.652 13.459L124 142.654v42.693a16 16 0 0 1-24.652 13.459l-89.206-57.347a16 16 0 0 1 0-26.918l89.206-57.347A16 16 0 0 1 124 70.654v42.692l87.348-56.152A16 16 0 0 1 236 70.654" />
              </svg>
            </a>
          </li>

          {/* Play */}
          <li>
            <a>
              <svg
                fill="currentColor"
                stroke="currentColor"
                class="w-5 h-5"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.008 12.897a.644.644 0 0 1-.91-.227.7.7 0 0 1-.098-.364V3.693C4 3.31 4.296 3 4.662 3a.64.64 0 0 1 .346.103l6.677 4.306a.713.713 0 0 1 0 1.182z" />
              </svg>
            </a>
          </li>
          {/* Record */}
          <li>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 fill-red-500"
                viewBox="0 0 52 52"
              >
                <path d="M26 8c9.9 0 18 8.1 18 18s-8.1 18-18 18S8 35.9 8 26 16.1 8 26 8" />
              </svg>
            </a>
          </li>
        </ul>
        <div class="flex gap-2 items-center ">
          <button class="btn-main p-2">
            <svg
              viewBox="0 0 800 800"
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M300 50h100v700H300L100 550l-73.038-30.676A44 44 0 0 1 0 478.757V324.938a44 44 0 0 1 25.284-39.822L100 250zm400 350c0-110.457-89.545-200-200-200V100c165.685 0 300 134.315 300 300S665.685 700 500 700V600c110.455 0 200-89.545 200-200"
                fill="currentColor"
              />
              <path
                d="M600 400c0 55.229-44.77 100-100 100V300c55.23 0 100 44.771 100 100"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Volume Range */}
          <input
            type="range"
            min="0"
            max="100"
            value="50"
            class="range range-xs max-w-36 max-h-7"
          />
        </div>
      </div>

      <div class="navbar-end gap-4">
        <button class="btn p-2 bg-primary text-neutral light:text-white">
          <svg
            viewBox="0 0 15 15"
            fill="currentColor"
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 1.5C0 0.671573 0.671573 0 1.5 0H10.0858C10.4836 0 10.8651 0.158035 11.1464 0.43934L14.5607 3.85355C14.842 4.13486 15 4.51639 15 4.91421V13.5C15 14.3284 14.3284 15 13.5 15H11V11.5C11 10.6716 10.3284 10 9.5 10H5.5C4.67157 10 4 10.6716 4 11.5V15H1.5C0.671573 15 0 14.3284 0 13.5V1.5Z"
              fill="currentColor"
            />
            <path
              d="M5 15H10V11.5C10 11.2239 9.77614 11 9.5 11H5.5C5.22386 11 5 11.2239 5 11.5V15Z"
              fill="currentColor"
            />
          </svg>
          Сохранить
        </button>
        <button class="btn p-2 bg-base-content text-neutral light:text-white">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 icon flat-color fill-black"
          >
            <path d="M21 20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 6 6 0 0 1 6-6h6a6 6 0 0 1 6 6m-9-8a5 5 0 1 0-5-5 5 5 0 0 0 5 5" />
          </svg>
          Пригласить
        </button>

        <ThemeController />
      </div>
    </nav>
  );
};

export default SyncopaUpperControlPanel;
