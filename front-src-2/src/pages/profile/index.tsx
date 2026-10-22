import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toaster } from "baseui/toast";

import { ProgressStepsContainer } from "@/components/ProgressSteps";
import RandomColors from "@/components/RandomColors";
import ButtonKit from "@/components/Button";
import { ProfileCart } from "@/components";
import { getUserProfileDetail } from "@/services/profile/profile-api";
import { AuthenticationType, ProfileType } from "@/types";
import Loading from "@/components/Loading";
import Alert from "@/components/global/Alert";
import BottomSheet from "@/components/global/BottomSheet";
import Typography from "@/components/Typography";
import { SheetButton, SheetContainer } from "../MyVehicle/style";
import Toaster from "@/components/global/Toast";
import { SupportContainer } from "@/layout/Navbar/style";
import { supportItems } from "@/data/navbar";
import ListItemButton from "@/components/ListItemButton";

import {
  ProfileCartItems,
  ProfilePartItems,
  steps,
} from "./formtools/constants";

import {
  ProfileContainer,
  TitleContainer,
  Paragraph,
  SteperContainer,
  SteperTitle,
  SteperParagraph,
  ButtonKitContainer,
  ItemsContainer,
  CartContainer,
  PartBody,
  PartIcon,
  PartText,
  UserContainer,
  UserImageAutorize,
  UserDetails,
  USerParagraph,
  UserContent,
  ProfileCartFlex,
  PartScroll,
} from "./style";
import { Tutorial } from "./Tutorial";

export default function Profile() {
  const PHONE = localStorage.getItem("Phone");
  const navigate = useNavigate();

  const [isOpenButtomSheet, setIsOpenButtomSheet] = useState<boolean>(false);
  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
  const [isOpenSupport, setIsOpenSupport] = useState<boolean>(false);

  const { data: profile, isLoading } = useQuery<ProfileType>(
    "PROFILE",
    getUserProfileDetail
  );

  const handleClick = (route: string) => {
    if (route === "/login") {
      setIsOpenButtomSheet(true);
    } else if (route === "/support") {
      setIsOpenSupport(true);
    } else navigate(route);
  };

  const userAuthorized = profile?.ProfileStepStatus === -1;

  let filterPartItem = ProfilePartItems;

  if (!userAuthorized) {
    filterPartItem = ProfilePartItems.filter(
      (item) => item.desc !== "ویرایش اطلاعات کاربری"
    );
  }

  // === enum definition for the user's authentication status ===
  const userAuth = {
    type: profile?.ProfileStepStatus as AuthenticationType,
  };

  return (
    <ProfileContainer>
      {/* @ts-ignore */}
      {!isLoading && !userAuthorized && (
        <TitleContainer hasProfile={userAuthorized}>
          <Paragraph>پروفایل</Paragraph>
        </TitleContainer>
      )}

      <Alert
        imgSrc={"/images/modal/check-list.svg"}
        isOpen={isOpenAlert}
        setIsOpen={setIsOpenAlert}
        buttonText="تکمیل ثبت نام"
        description="برای رزرو بار ، ابتدا ثبت نام خود را تکمیل کنید"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* (profile && AddressImage !== null) ||
          (profile && FullName !== " ") ? ( */}
          {userAuthorized ? (
            <UserContainer>
              <TitleContainer hasProfile={userAuthorized}>
                <Paragraph>پروفایل</Paragraph>
              </TitleContainer>
              <UserContent>
                {profile?.AddressImage ? (
                  <UserImageAutorize
                    src={profile?.AddressImage}
                    alt="profile"
                  />
                ) : (
                  <RandomColors
                    fullName={profile?.FullName}
                    width="72px"
                    height="72px"
                    fontSize="28px"
                  />
                )}
                <UserDetails>
                  <USerParagraph>{profile?.FullName}</USerParagraph>
                  <USerParagraph>{PHONE}</USerParagraph>
                </UserDetails>
              </UserContent>
            </UserContainer>
          ) : (
            <SteperContainer>
              <SteperTitle>تکمیل ثبت نام</SteperTitle>
              <SteperParagraph>
                برای دسترسی به خدمات صبابار ، ثبت نام خود را تکمیل کنید
              </SteperParagraph>

              <ProgressStepsContainer
                steps={steps}
                current={userAuth.type === 3 ? 0 : userAuth.type}
                fontSize="10px"
              />

              <ButtonKitContainer>
                <ButtonKit
                  width="157px"
                  height="48px"
                  text={
                    profile?.ProfileStepStatus === 0
                      ? "شروع فرایند ثبت نام"
                      : "ادامه فرایند ثبت نام"
                  }
                  theme="blue"
                  shape="pill"
                  onClick={() => navigate("/Identity")}
                />
              </ButtonKitContainer>
            </SteperContainer>
          )}
        </>
      )}
      {/* @ts-ignore */}
      {!isLoading && (
        <ItemsContainer profile={userAuthorized}>
          <CartContainer>
            {ProfileCartItems.map((item) => (
              <ProfileCartFlex
                key={item.id}
                // @ts-ignore
                id={item.id}
                onClick={() => {
                  if (!userAuthorized && item.id !== "tire-store" && item.desc !== "جوایز و مسابقات") {
                    return setIsOpenAlert(true);
                  } else if (item.id === 3) {
                    toaster.warning(<Toaster type="negative" text="به زودی" />);
                  } else {
                    navigate(item.route);
                  }
                }}>
                <ProfileCart item={item} />
              </ProfileCartFlex>
            ))}
          </CartContainer>

          <Tutorial />

          {/* @ts-ignore */}
          <PartScroll userAuthorized={userAuthorized}>
            {filterPartItem.map((item) => (
              <PartBody onClick={() => handleClick(item.route)} key={item.id}>
                {item.iconSrc && <PartIcon src={item.iconSrc} alt={item.desc} />}
                <PartText>{item.desc}</PartText>
              </PartBody>
            ))}
          </PartScroll>
        </ItemsContainer>
      )}

      {/* === support item bottom-sheet === */}
      <BottomSheet
        title="پشتیبانی"
        closeable={true}
        isOpen={isOpenSupport}
        onClose={() => setIsOpenSupport(false)}>
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

      {/* === log-out item bottom-sheet === */}
      <BottomSheet
        isOpen={isOpenButtomSheet}
        onClose={() => setIsOpenButtomSheet(false)}>
        <SheetContainer>
          <Typography
            title="مطمئن هستید که می خواهید از حساب خود خارج شوید؟"
            type="LabelMedium"
          />
          <SheetButton>
            <ButtonKit
              type="button"
              width="100%"
              height="48px"
              onClick={() => setIsOpenButtomSheet(false)}
              text={"انصراف"}
            />
            <ButtonKit
              type="button"
              width="100%"
              height="48px"
              text={"خروج"}
              theme="secondaryRed"
              onClick={() => {
                Cookies.remove("Token");
                Cookies.remove("referral");
                Cookies.remove("Guid");

                localStorage.removeItem("Phone");
                localStorage.removeItem("ISAUTH");
                localStorage.removeItem("ROLE");
                localStorage.removeItem("isNatural");

                navigate("/login");
              }}
            />
          </SheetButton>
        </SheetContainer>
      </BottomSheet>
    </ProfileContainer>
  );
}
