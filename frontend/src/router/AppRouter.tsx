import { Route, Router } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import { withAuth } from "../components/utils/withAuth";
import { withGuest } from "../components/utils/withGuest";

const Landing = lazy(() => import("../pages/Landing"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ProjectsManagement = lazy(() => import("../pages/ProjectsManagement"));

const NotFound404 = lazy(() => import("../pages/errors/NotFound404"));

const SyncopaApp = lazy(() => import("../pages/SyncopaApp"));

const ProtectedProjectsProtected = withAuth(ProjectsManagement);
const ProtectedSyncopaApp = withAuth(SyncopaApp);

const LoginGuest = withGuest(Login);
const RegisterGuest = withGuest(Register);

const AppRouter: Component = () => {
  return (
    <Router>
      <Route path="/" component={Landing} />
      <Route path="login/" component={LoginGuest} />
      <Route path="register/" component={RegisterGuest} />
      <Route path="projects/" component={ProtectedProjectsProtected} />
      <Route path="projects/:uuid" component={ProtectedSyncopaApp} />
      <Route path="*404" component={NotFound404} />
    </Router>
  );
};

export default AppRouter;
