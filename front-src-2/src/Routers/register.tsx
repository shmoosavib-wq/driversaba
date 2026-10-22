import type { RouteObject } from "react-router-dom";

import { UserSelect, UserType } from "@/pages";
import Navbar from "@/layout/Navbar";

const RegisterRoutes: RouteObject[] = [
  {
    path: "/reg/user-select",
    element: (
      <Navbar title="انتخاب نقش">
        <UserSelect />
      </Navbar>
    ),
  },
  {
    path: "/reg/user-type",
    element: (
      <Navbar title="انتخاب کاربری">
        <UserType />
      </Navbar>
    ),
  },
];

export default RegisterRoutes;
