import { createSignal } from "solid-js";

const [accessToken, setAccessToken] = createSignal<string | null>(null);

export { accessToken, setAccessToken };
