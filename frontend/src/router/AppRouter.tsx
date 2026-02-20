import { Route, Router } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import { withAuth } from "../components/utils/withAuth";

const Landing = lazy(() => import("../pages/Landing"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ProjectsManagement = lazy(() => import("../pages/ProjectsManagement"));

const NotFound404 = lazy(() => import("../pages/errors/NotFound404"));

const ProtectedProjectsProtected = withAuth(ProjectsManagement);

const AppRouter: Component = () => {
  return (
    <Router>
      <Route path="/" component={Landing} />
      <Route path="login/" component={Login} />
      <Route path="register/" component={Register} />
      <Route path="app/" component={ProtectedProjectsProtected} />
      <Route path="*404" component={NotFound404} />
    </Router>
  );
};

export default AppRouter;
