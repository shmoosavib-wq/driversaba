import { useState } from "react";

import WeekDays from "../WeekDays";
import CityDropDown from "../CityDropDown";
import BottomSheet from "../global/BottomSheet";
import { SupportContainer } from "@/layout/Navbar/style";
import { supportItems } from "@/data/navbar";
import { Link, useNavigate } from "react-router-dom";
import ListItemButton from "../ListItemButton";

import {
  NavContainer,
  NavTitle,
  NavItems,
  DropDownContainer,
  TextSupport,
  TextTitle,
  SupportImg,
} from "./style";

export default function NavCargoList() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavContainer>
      <NavTitle>
        <TextTitle>لیست بارها</TextTitle>
        <NavItems onClick={() => setIsOpen(true)}>
          <TextSupport>تماس با پشتیبانی</TextSupport>
          <SupportImg src={"/images/icons/support.svg"} alt="Support" />
        </NavItems>
      </NavTitle>

      <DropDownContainer>
        <CityDropDown
          title="انتخاب مسیر"
          placeHolder="انتخاب مسیر"
          shortURL={"CargoLocations"}
        />
      </DropDownContainer>
      <WeekDays />

      <BottomSheet
        title="پشتیبانی"
        closeable={true}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}>
        <SupportContainer>
          {supportItems.map((i, idx) =>
            i.hasOwnProperty("link") ? (
              <Link to={i.link} style={{ width: "100%" }} key={idx}>
                <ListItemButton label={i.label} imgSrc={i.imgSrc} noBorder />
              </Link>
            ) : (
              <ListItemButton
                key={idx}
                label={i.label}
                imgSrc={i.imgSrc}
                onClick={() => navigate(i.route)}
                noBorder
              />
            )
          )}
        </SupportContainer>
      </BottomSheet>
    </NavContainer>
  );
}
