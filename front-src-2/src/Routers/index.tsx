import { createBrowserRouter } from "react-router-dom";

import RequireAuth from "@/components/RequireAuth/index";
import RequireConfirm from "@/components/RequireConfirm/index";
import RequireRegister from "@/components/RequireRegister";
import Navbar from "@/layout/Navbar";
import { Support } from "@/pages/Support";
import SabaServices from "@/pages/sabaServices";
import RemittanceRequest from "@/pages/sabaServices/remittanceRequest";
import WaybillRequest from "@/pages/sabaServices/wayBillRequest";
import Rules from "@/pages/Rules";
import PageNotFound from "@/pages/404";
import EducationDetail from "@/pages/EducationDetail";
import Education from "@/pages/Education";
import CommonQuestions from "@/pages/CommonQuestions";

import AuthRoutes from "./auth";
import ConfirmRoutes from "./confirm";
import RegisterRoutes from "./register";
import ProtectedRoutes from "./protected";

// path => kebab-case
export const router = createBrowserRouter([
  ...AuthRoutes,
  {
    element: <RequireConfirm />,
    children: ConfirmRoutes,
  },
  {
    element: <RequireAuth />,
    children: ProtectedRoutes,
  },
  {
    element: <RequireRegister />,
    children: RegisterRoutes,
  },
  {
    path: "/Support",
    element: (
      <Navbar title="پشتیبانی">
        <Support />
      </Navbar>
    ),
  },
  {
    path: "/remittance-request",
    element: <RemittanceRequest />,
  },
  {
    path: "/saba-services",
    element: <SabaServices />,
  },
  {
    path: "/waybill-request",
    element: <WaybillRequest />,
  },
  {
    path: "/education/:id",
    element: <EducationDetail />,
  },
  {
    path: "/education",
    element: <Education />,
  },
  {
    path: "common-questions",
    element: <CommonQuestions />,
  },
  {
    path: "/rules",
    element: (
      <Navbar title="قوانین و مقرات">
        <Rules />
      </Navbar>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
