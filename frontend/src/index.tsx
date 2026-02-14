/* @refresh reload */
import "solid-devtools";
import { render } from "solid-js/web";
import "./index.css";

import { Route, Router } from "@solidjs/router";
import NotFound404 from "./pages/errors/NotFound404";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Toaster } from "solid-toast";

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
    <>
      <Router>
        <Route path="/" component={Landing} />
        <Route path="login/" component={Login} />
        <Route path="register/" component={Register} />
        <Route path="app/" component={Projects} />
        <Route path="*404" component={NotFound404} />
      </Router>
      <Toaster position="top-center" gutter={24} />
    </>
  ),
  root!,
);
