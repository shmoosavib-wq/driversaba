import type { RouteObject } from "react-router-dom";

import { Verification } from "@/pages";
import Navbar from "@/layout/Navbar";

const ConfirmRoutes: RouteObject[] = [
  {
    path: "/verification",
    element: (
      <Navbar title="اعتبارسنجی">
        <Verification />
      </Navbar>
    ),
  },
];

export default ConfirmRoutes;
