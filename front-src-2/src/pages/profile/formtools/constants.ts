interface CartItemType {
  id: number | string;
  imgSrc: string;
  desc: string;
  route: string;
}

export const ProfileCartItems: CartItemType[] = [
  {
    id: "history-movement",
    imgSrc: "/images/profile/cart-item/group.svg",
    desc: "سیر های گذشته",
    route: "/HistoryMovement",
  },
  {
    id: "my-vehicle",
    imgSrc: "/images/profile/cart-item/frame.svg",
    desc: "ناوگان های من",
    route: "/MyVehicle",
  },

  {
    id: "tire-store",
    imgSrc: "/images/profile/cart-item/tire.svg",
    desc: "خرید قسطی تایر",
    route: "/tire-store",
  },
];

export const ProfilePartItems = [
  // {
  //   id: 1,
  //   iconSrc: "/images/profile/part-item/truk.svg",
  //   desc: "باربری های برتر",
  //   route: "",
  // },
  // {
  //   id: 2,
  //   iconSrc: "/images/profile/part-item/teacher.svg",
  //   desc: "آموزش و راهنمایی",
  //   route: "/education",
  // },
  {
    id: 4,
    iconSrc: "/images/profile/part-item/user-edit.svg",
    desc: "ویرایش اطلاعات کاربری",
    route: "/editInformation",
  },
  {
    id: 6,
    iconSrc: "/images/profile/part-item/sms.svg",
    desc: "دعوت از دوستان",
    route: "invitation",
  },
  {
    id: "tire-installments",
    iconSrc: "/images/profile/part-item/document.svg",
    desc: "قسط‌های خرید تایر",
    route: "/tire-store?view=installments",
  },
  {
    id: "tire-history",
    iconSrc: "/images/profile/part-item/refresh.svg",
    desc: "تاریخچه خرید تایر",
    route: "/tire-store?view=history",
  },
  {
    id: 3,
    iconSrc: "/images/profile/part-item/group.svg",
    desc: "پشتیبانی",
    route: "/support",
  },
  // {
  //   id: 5,
  //   iconSrc: "/images/profile/part-item/refresh.svg",
  //   desc: "تغییر نقش کاربری",
  //   route: "/reg/user-select",
  // },
  {
    id: 7,
    iconSrc: "/images/profile/part-item/document.svg",
    desc: "قوانین و مقررات",
    route: "/rules",
  },
  {
    id: 8,
    iconSrc: "/images/profile/part-item/logout.svg",
    desc: "خروج",
    route: "/login",
  },
];

export const steps = [
  {
    id: 1,
    title: "احراز هویت",
  },
  {
    id: 2,
    title: "اطلاعات کاربری",
  },
  {
    id: 3,
    title: "ثبت اولین ناوگان",
  },
];
