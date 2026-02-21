import { Component, Show } from "solid-js";
import { Navigate } from "@solidjs/router";
import { useAuth } from "../../hooks/auth/useAuth";
import SyncopaLoader from "./SyncopaLoading";

export function withGuest(ComponentToWrap: Component): Component {
  return () => {
    const { accessToken, loading } = useAuth();

    return (
      <Show when={!loading()} fallback={<SyncopaLoader/>}>
        <Show
          when={!accessToken()}
          fallback={<Navigate href="/app" />}
        >
          <ComponentToWrap />
        </Show>
      </Show>
    );
  };
}