import { Component, Show } from "solid-js";
import { Navigate } from "@solidjs/router";
import SyncopaLoader from "./SyncopaLoading";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

export function withGuest(ComponentToWrap: Component): Component {
  return () => {
    const { accessToken, loading } = useAuthContext();

    return (
      <Show when={!loading()} fallback={<SyncopaLoader/>}>
        <Show
          when={!accessToken()}
          fallback={<Navigate href="/projects" />}
        >
          <ComponentToWrap />
        </Show>
      </Show>
    );
  };
}