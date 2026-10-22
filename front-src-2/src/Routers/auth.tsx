import type { RouteObject } from "react-router-dom";

import { Login } from "@/pages";

const AuthRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
];

export default AuthRoutes;
