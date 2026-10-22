import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { ProgressStepsContainer } from "@/components/ProgressSteps";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";
import BottomSheet from "@/components/global/BottomSheet";
import ListItemButton from "@/components/ListItemButton";
import { supportItems } from "@/data/navbar";

import {
  Box,
  Distonation,
  Nav,
  NavContainer,
  NavItems,
  NavSupport,
  NavTitle,
  LocationContainer,
  Section,
  SupportContainer,
} from "./style";
interface NavbarT {
  title: string;
  current?: number;
  steps?: any[];
  DestinationCity?: string;
  OriginCity?: string;
  truck?: string;
  isBackButtonVisible?: boolean;
  isSupport?: boolean;
  children?: any;
}
const Navbar = ({
  title,
  current = 0,
  steps,
  children,
  DestinationCity = null,
  OriginCity = null,
  truck = null,
  isBackButtonVisible = true,
  isSupport = true,
}: NavbarT) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Nav>
        <NavContainer>
          <Box>
            {isBackButtonVisible && (
              <Image
                src="/icons/arrow-left.svg"
                alt="history"
                onClick={() => {
                  if (location.search) {
                    navigate("/");
                  } else {
                    navigate(-1);
                  }
                }}
              />
            )}

            <NavTitle>{title}</NavTitle>
          </Box>
          {isSupport && (
            <>
              {location.pathname.includes("Support") ? null : (
                <div onClick={() => setIsOpen(true)}>
                  <NavItems>
                    <NavSupport>تماس با پشتیبانی</NavSupport>
                    <Image src="/icons/support.svg" alt="support" />
                  </NavItems>
                </div>
                // <Link to={"/Support"}>
                //   <NavItems>
                //     <NavSupport>تماس با پشتیبانی</NavSupport>
                //     <Image src="/icons/support.svg" alt="support" />
                //   </NavItems>
                // </Link>
              )}
            </>
          )}
        </NavContainer>
        {steps && (
          <ProgressStepsContainer
            steps={steps}
            current={current}
            fontSize="12px"
          />
        )}
        {(location.pathname.includes("cargoDetail") || DestinationCity) && (
          <Distonation>
            <LocationContainer>
              <Image src="/cargoDetail/location.svg" alt="location" />
              <Typography title={OriginCity} type="LabelMedium" />
              <Image src="/cargoDetail/arrow.svg" alt="arrow" />
              <Typography title={DestinationCity} type="LabelMedium" />
            </LocationContainer>
          </Distonation>
        )}

        {truck && (
          <Section>
            <Image src="/cargoStatus/truck.svg" alt="truck" />
            <Typography title={truck} type="LabelMedium" />
          </Section>
        )}
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
      </Nav>
      {children}
    </>
  );
};
export default Navbar;
