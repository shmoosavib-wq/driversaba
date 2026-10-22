import { Step } from "react-joyride";

export const ProfileOnboarding: Step[] = [
  {
    title: "سیرهای گذشته",
    target: "#history-movement",
    content:
      "در این قسمت می توانید اطلاعات کامل سیر های گذشته خود را مشاهده کنید",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    title: "ناوگان های من",
    target: "#my-vehicle",
    content: "مدیریت و افزودن ناوگان ها در این قسمت انجام می شوند",
    placement: "bottom",
    disableBeacon: true,
  },
];
