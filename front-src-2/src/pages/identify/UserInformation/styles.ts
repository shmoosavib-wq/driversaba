import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Loading = styled.section`
  position: absolute;
  inset: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  overflow: hidden;
`;

interface UserInfoSectionProps {
  routeStyle?: boolean;
}
export const UserInfoSection = styled.section<UserInfoSectionProps>`
  inset: 0px;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  height: ${({ routeStyle }) =>
    routeStyle ? "calc(100dvh - 180px - 80px)" : "calc(100% - 50px)"};
`;

export const UserInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 60%;
  justify-content: center;
  width: 100%;
  direction: rtl;
  @media ${device.lg} {
    flex-wrap: nowrap;
    width: 46.875rem;
    justify-content: space-between;
    margin: auto;
    height: 50%;
    gap: 3.375rem;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  width: 90%;
  margin: auto;
  gap: 0.75rem;

  @media ${device.lg} {
    width: 21.75rem;
  }
`;
export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  margin-bottom: 1rem;
  width: 90%;
  @media ${device.lg} {
    position: relative;
    margin-right: 13.7rem;
    height: auto;
    width: 38%;
    display: flex;
    align-items: end;
    margin-top: 3.75rem;
  }
`;
export const DropDownWrapper = styled.div`
  height: 2.25rem;
  width: 100%;
  margin-bottom: 1.8rem;

  @media ${device.md} {
    height: 3rem;
  }
`;
export const DropDownContainer = styled.div`
  display: flex;
  direction: rtl;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  gap: 0.75rem;
  padding-left: 0.875rem;
  padding-right: 0.875rem;
  padding-top: 0rem;
  padding-bottom: 0rem;
  margin: 8px;
`;
export const UploadSection = styled.div`
  width: 90%;
  margin-top: 27px;
  @media ${device.lg} {
    height: 53%;

    width: 21.75rem;
  }
`;
