import {
  Location,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";

const getUrl = (l: Location<any>) => {
  let url = "/login";

  if (l.pathname && l.pathname !== "/") {
    url += `?returnUrl=${l.pathname}${l.search}`;

    if (l.search.includes("ref")) {
      Cookies.set("referral", l.search.split("=")[2]);
    }
  } else if (l.search) {
    if (l.search.includes("ref")) {
      Cookies.set("referral", l.search.split("=")[1]);
    }
    url += `?returnUrl=${l.search}`;
  }

  return url;
};

export default function RequireAuth() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthorized = Cookies.get("Token");

  useEffect(() => {
    getUrl(location);
  }, [isAuthorized, location, navigate]);

  if (!isAuthorized) return <Navigate to={getUrl(location)} replace />;
  return <Outlet />;
}
