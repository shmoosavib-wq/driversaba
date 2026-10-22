import { Navigate, Outlet } from "react-router-dom";

import Cookies from "js-cookie";

export default function RequireRegister() {
  const isRegister = Cookies.get("Guid");
  const Token = Cookies.get("Token");
  console.log(Token);

  if (!isRegister && !Token) return <Navigate to="/verification" replace />;
  return <Outlet />;
}
