import { Component } from "solid-js";
import ProjectItemContextMenu from "./ProjectItemContextMenu";
import ProjectMembersAvatars from "./ProjectMembersAvatars";

const ProjectItemCard: Component<ProjectItemProps> = (project) => {
  return (
    <div
      class="group relative flex flex-col justify-between h-52 w-full p-6
                bg-base-200 light:bg-base-300 border border-base-300 rounded-2xl cursor-pointer
                transition-all duration-300 ease-out
                hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30"
    >
      <div class="flex justify-between items-start">
        <h3
          class="text-xl font-bold tracking-tight text-base-content leading-tight
                   group-hover:text-primary light:group-hover:text-[#1e1810] transition-colors line-clamp-2 max-w-[85%]"
          title={project.title}
        >
          {project.title}
        </h3>

        <div class="relative z-10">
          <ProjectItemContextMenu>
            <button class="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-primary hover:bg-primary/10 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 12h.01M12 6h.01M12 18h.01"
                />
              </svg>
            </button>
          </ProjectItemContextMenu>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex items-center">
          <ProjectMembersAvatars />
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-base-200">
          <span class="text-xs uppercase tracking-[0.1em] font-bold text-base-content/30">
            Изменено
          </span>
          <span class="text-xs font-medium text-base-content/50">
            {project.updatedAt}
          </span>
        </div>
      </div>

      <div class="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
    </div>
  );
};

export default ProjectItemCard;
