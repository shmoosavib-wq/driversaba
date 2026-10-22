import { Step } from "react-joyride";

export const CargoListOnboarding: Step[] = [
  {
    title: "معرفی اولیه",
    target: "#initial-introduction",
    content: "به صبابار خوش آمدید. برای یادگیری رزرو بار همراه ما باشید",
    placement: "center",
    disableBeacon: false,
  },
  {
    title: "مشاهده بار",
    target: "#load-view",
    content:
      "با کلیک بر روی دکمه مشاهده بار می توانید اطلاعات بیشتری از بار مشاهده کنید",
    placement: "bottom",
    disableBeacon: false,
  },
  {
    title: "انتخاب مسیر",
    target: "#path-selection",
    content: "در این بخش می توانید مسیر های موجود را مشاهده و انتخاب کنید",
    placement: "bottom",
    disableBeacon: false,
  },
  {
    title: "وضعیت بار",
    target: "#load-state",
    content:
      "پس از قبول بار ، حواله و بارنامه شما در این بخش در دسترس هستند و تصاویر باسکول را نیز در این بخش آپلود می کنید",
    placement: "top",
    disableBeacon: false,
  },
  {
    title: "پروفایل",
    target: "#profile",
    content: "مشاهده سیر های گذشته و مدیریت ناوگان ها در این بخش در دسترس اند",
    placement: "top",
    disableBeacon: false,
  },
];
