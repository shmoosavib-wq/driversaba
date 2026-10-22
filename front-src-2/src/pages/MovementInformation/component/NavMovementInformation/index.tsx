import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Typography from "../../../../components/Typography";
import MovementTab from "@/pages/MovementInformation/component/Tab";
import Image from "@/components/global/Image";
import BottomSheet from "@/components/global/BottomSheet";
import { supportItems } from "@/data/navbar";
import ListItemButton from "@/components/ListItemButton";
import { SupportContainer } from "@/layout/Navbar/style";

import {
  NavContainer,
  NavTitle,
  NavItems,
  TextSupport,
  TextTitle,
  SupportImg,
  TitleContainer,
  LocationContainer,
} from "./style";

export default function NavMovementInformation({
  OriginCity,
  DestinationCity,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavContainer>
      <NavTitle>
        <TitleContainer>
          <Image
            src="/icons/arrow-left.svg"
            alt="history"
            onClick={() => navigate(-1)}
          />
          <TextTitle>اطلاعات سیر</TextTitle>
        </TitleContainer>
        {/* <Link to={"/Support"}> */}
          <NavItems onClick={() => setIsOpen(true)}>
            <TextSupport>تماس با پشتیبانی</TextSupport>
            <SupportImg src={"/images/icons/support.svg"} alt="Support" />
          </NavItems>
        {/* </Link>F */}
      </NavTitle>

      <LocationContainer>
        <Image src="/cargoDetail/location.svg" alt="location" />
        <Typography title={OriginCity} type="ParagraphMedium" />
        <Image src="/cargoDetail/arrow.svg" alt="arrow" />
        <Typography title={DestinationCity} type="ParagraphMedium" />
      </LocationContainer>

      <MovementTab />
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
