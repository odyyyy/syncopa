import { BACKEND_URL } from "../config/config";
import { useAuthFetch } from "../hooks/auth/useAuthFetch";
import { ProjectWithPayload, ProjectPayload } from "../types/daw.types";
import { Preset, PresetConfig } from "../types/presets.types";
import { apiRequest } from "./base.api";

const useDawApi = () => {
  const protectedRequest = useAuthFetch();

  const getProjectWithPayload = (
    project_id: string,
  ): ApiResponse<ProjectWithPayload> =>
    apiRequest(
      `${BACKEND_URL}/daw/payload/${project_id}`,
      {
        method: "GET",
      },
      protectedRequest,
    );

  const updateProjectPayload = (
    project_id: string,
    payload: ProjectPayload,
  ): ApiResponse<ProjectWithPayload> =>
    apiRequest(
      `${BACKEND_URL}/daw/payload/${project_id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      },
      protectedRequest,
    );

  const getPresetsCatalog = (): ApiResponse<Preset[]> =>
    apiRequest(
      `${BACKEND_URL}/daw/presets`,
      {
        method: "GET",
      },
      protectedRequest,
    );

  const getUsedInProjectPresetsConfigs = (
    usedPresetsIds: number[],
  ): ApiResponse<PresetConfig[]> => {
    const params = new URLSearchParams();
    usedPresetsIds.forEach((presetId) =>
      params.append("presets", presetId.toString()),
    );

    return apiRequest(
      `${BACKEND_URL}/daw/presets?${params.toString()}`,
      {
        method: "GET",
      },
      protectedRequest,
    );
  };

  const getPresetConfigById = (preset_id: number): ApiResponse<PresetConfig> =>
    apiRequest(
      `${BACKEND_URL}/daw/presets/${preset_id}`,
      {
        method: "GET",
      },
      protectedRequest,
    );

  return {
    getProjectWithPayload,
    updateProjectPayload,
    getPresetsCatalog,
    getPresetConfigById,
    getUsedInProjectPresetsConfigs,
  };
};

export default useDawApi;
