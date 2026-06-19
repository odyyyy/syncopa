export const BACKEND_URL = "/api";
export const MIN_MASTER_VOLUME_DB = -60;

const PATHS = {
  basePath: "frontend",
  public: "public",
  samplesPath: "samples",
};

export function getSamplesBasePath() {
  return [window.location.origin, PATHS.public, PATHS.samplesPath].join("/");
}

export const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
