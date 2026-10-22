import Profile from "@/pages/profile";

import { Icon1, Icon2, Icon3 } from "../helper";
import CargoList from "@/pages/cargo/CargoList";
import LoadState from "@/pages/loadState";

export const LayoutData = [
  {
    id: 0,
    slug: "list",
    title: "لیست بار ها",
    icon: Icon2,
    component: CargoList,
  },
  {
    id: 1,
    slug: "status",
    title: "وضعیت بار",
    icon: Icon1,
    component: LoadState,
  },
  {
    id: 2,
    slug: "profile",
    title: "پروفایل",
    icon: Icon3,
    component: Profile,
  },
];
