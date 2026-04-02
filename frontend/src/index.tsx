/* @refresh reload */
import "solid-devtools";
import { render, Suspense } from "solid-js/web";
import "./index.css";

import { Toaster } from "solid-toast";
import { AuthProvider } from "./context/auth";
import AppRouter from "./router/AppRouter";
import SyncopaLoader from "./components/utils/Loaders/SyncopaLoading";
const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <>
      <AuthProvider>
        <Suspense fallback={<SyncopaLoader />}>
          <AppRouter />
        </Suspense>
        <Toaster position="top-center" gutter={24} />
      </AuthProvider>
    </>
  ),
  root!,
);
