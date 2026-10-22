import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const ProfileContainer = styled.div`
  width: 100%;
  height: 100dvh;
  background-color: #fff;
`;

interface TitleContainerProps {
  hasProfile: boolean;
}
export const TitleContainer = styled.div<TitleContainerProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ hasProfile }) => (hasProfile ? "" : "5px 0")};
  background: ${({ hasProfile }) => (hasProfile ? "" : "#fff")};
  margin: 10px 0px 10px 0px;
`;

export const Paragraph = styled.h1`
  font-size: 14px;
  font-weight: 600;
`;

export const UserContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 0 20px;
  padding-top: 30px;
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 210px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(140deg, #aaa, #fff, #aaa);
  gap: 0 20px;
  padding-bottom: 60px;
`;

export const UserImageAutorize = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
`;

interface UserProfileType {
  color: React.CSSProperties["backgroundColor"];
}
export const UserProfile = styled.p<UserProfileType>`
  width: 62px;
  height: 62px;
  border-radius: 50%;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  background-color: ${({ color }) => color && color};
`;

export const UserDetails = styled.div``;

export const USerParagraph = styled.p`
  font-size: 16px;
  font-weight: 600;
  direction: rtl;
  padding: 3px 0;
`;

export const UserNumber = styled.p``;

export const SteperContainer = styled.div`
  width: 90%;
  // height: 240px;
  margin: 0 auto;
  border: 2px solid #e8e8e8;
  border-radius: 20px;
  padding: 20px;
  direction: ltr;
`;

export const SteperTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  direction: rtl;
`;

export const SteperParagraph = styled.p`
  font-size: 12px;
  font-weight: 400;
  direction: rtl;
  margin-top: 10px;
  color: #2d2d2d;
`;

export const SteperFlex = styled.div`
  width: 100%;
  margin: 0 auto;
  background-color: red;
`;

export const ButtonKitContainer = styled.div`
  width: 60%;

  & button {
    font-weight: 600;
    font-size: 12px;

    @media (min-width: 340px) {
      font-size: 14px;
    }
  }
`;

interface ItemsContainerType {
  // باید بولین باشه
  profile: any;
}
export const ItemsContainer = styled.div<ItemsContainerType>`
  width: 100%;
  border-radius: 20px 20px 0 0;
  padding: 16px;
  padding-bottom: 0;
  background-color: #fff;
  gap: 16px;
  display: flex;
  flex-direction: column;

  border-top: ${({ profile }) => (profile ? "none" : "2px solid #e8e8e8")};
  margin-top: ${({ profile }) => (profile ? "-20px" : "20px")};
  // border-top: 2px solid #e8e8e8;
  // margin-top: 20px;

  height: calc(100% - 210px - var(--bottom-tab-size) + 20px);
`;

export const CartContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0 12px;
  height: 124px;
`;

interface PartScrollType {
  userAuthorized: any;
}
export const PartScroll = styled.div<PartScrollType>`
  overflow: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px 0;
  padding: 16px 0;

  height: ${({ userAuthorized }) =>
    userAuthorized
      ? "calc(100% - 124px); // 124px: CartContainers"
      : "calc(100% - 210px - var(--bottom-tab-size) + 10px)"};
`;

// height: calc(100% - 124px); // 124px: CartContainers
// height: calc(100% - 210px - var(--bottom-tab-size) + 20px)

export const PartBody = styled.div`
  display: flex;
  align-items: center;
  gap: 0 15px;
  cursor: pointer;
`;

export const PartIcon = styled.img``;

export const PartText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
`;

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileCartFlex = styled.div`
  width: 100%;
  height: 124px;
  cursor: pointer;
  // @media ${device.xs} {
  //   width: 105px;
  //   height: 112px;
  // }
`;
