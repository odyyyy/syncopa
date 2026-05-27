import { Navigate } from "@solidjs/router";
import { Component, Show } from "solid-js";
import SyncopaLoader from "./Loaders/SyncopaLoading";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

export function withAuth(ComponentToProtect: Component): Component {
  return () => {
    const { accessToken, loading } = useAuthContext();

    return (
      <Show when={!loading()} fallback={<SyncopaLoader />}>
        <Show when={accessToken()} fallback={<Navigate href="/register" />}>
          <ComponentToProtect />
        </Show>
      </Show>
    );
  };
}
