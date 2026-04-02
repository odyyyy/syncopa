export const BACKEND_URL = "/api";
export const MIN_MASTER_VOLUME_DB = -60;

const PATHS = {
  basePath: "frontend",
  public: "public",
  samplesPath: "samples",
};

export function getSamplesBasePath() {
  return [
    window.location.origin,
    PATHS.public,
    PATHS.samplesPath,
  ].join("/");
}


