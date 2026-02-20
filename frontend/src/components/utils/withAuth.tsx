import { Navigate } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { useAuth } from "../../hooks/auth/useAuth";
import SyncopaLoader from "./SyncopaLoading";

export function withAuth(ComponentToProtect: Component): Component {
  return () => {
    const { accessToken, loading } = useAuth();

    return (
      <Show when={!loading()} fallback={<SyncopaLoader />}>
        <Show when={accessToken()} fallback={<Navigate href="/login" />}>
          <ComponentToProtect />
        </Show>
      </Show>
    );
  };
}
