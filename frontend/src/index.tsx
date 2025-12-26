/* @refresh reload */
import "solid-devtools";
import { render } from "solid-js/web";
import "./index.css";

import { Route, Router } from "@solidjs/router";
import App from "./pages/App";
import NotFound404 from "./pages/Errors/NotFound404";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";

// const Users = lazy(() => import("./pages/Users"));
// const Home = lazy(() => import("./pages/Home"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router >
      <Route path="" component={Landing} />
      <Route path="/app" component={Projects} />
      <Route path="/app/project/:id" component={App} />
      <Route path="*404" component={NotFound404}  />
    </Router>
  ),
  root!,
);
