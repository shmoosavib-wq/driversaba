import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

type PwaPropsType = {
  showInstallBtn?: boolean;
};
export const PwaBanner = styled.div<PwaPropsType>`
  background-color: #01acbc;
  color: #fff;
  padding: 8px;
  margin: 0 auto;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;

  display: ${(props) => (props.showInstallBtn ? "flex" : "none")};
`;

export const PwaButton = styled.button`
  padding: 4px;
  color: #01acbc;
  background-color: #fff;
  border-radius: 10px;
`;

export const PwaText = styled.p`
  margin-left: 8px;
`;

export const Body = styled.div`
  padding-top: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px 0;

  @media ${device.sm} {
    width: 90%;
    gap: 0 0;
    padding-top: 0;
  }
  @media ${device.md} {
    width: 80%;
    flex-direction: row-reverse;
    height: fit-content;
  }
  @media ${device.lg} {
    width: 80%;
  }
  @media ${device.xl} {
    width: 60%;
  }
`;

export const LeftContent = styled.div`
  width: 100%;
  // height: 50%;
  align-items: center;
  justify-content: center;
  align-self: flex-end;

  @media ${device.md} {
    display: flex;
    height: 45%;
  }
  @media ${device.lg} {
    height: 40%;
  }
`;

export const LogoContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;

  @media ${device.md} {
    display: none;
  }
`;

export const LeftContentImg = styled.img`
  margin: 0 auto;
  width: 90%;
  height: 90%;
`;

export const RightContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 34px 0;

  @media ${device.sm} {
    padding-top: 32px;
  }

  @media ${device.md} {
    height: 32%;
    padding-top: 0;
    padding-bottom: 0;
    justify-content: space-around;
  }

  @media ${device.lg} {
    height: 33%;
  }

  @media ${device.xl} {
    gap: 38px 0;
  }
`;

export const RightLogo = styled.div`
  display: none;
  align-items: center;
  // align-self: flex-end;
  gap: 0 12px;

  @media ${device.md} {
    display: flex;
  }
`;

export const RightParagraphLogo = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

export const InputContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media ${device.sm} {
    // justify-content: flex-end;
    height: 100%;
  }
`;

export const InputContent = styled.div`
  width: 100%;

  @media ${device.md} {
    width: 80%;
    height: 40%;
  }

  @media ${device.lg} {
    width: 70%;
    height: 48px;
    padding-bottom: 100px;
  }
`;

export const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  // align-self: end;

  @media ${device.md} {
    width: 80%;
  }

  @media ${device.lg} {
    width: 70%;
  }
`;

export const RulesParaghraph = styled.p`
  font-size: 12px;
  padding-bottom: 8px;
  display: flex;
  gap: 0 4px;

  @media ${device.lg} {
    font-size: 13px;
  }

  @media ${device.xl} {
    font-size: 14px;
  }
`;

export const RulesSpan = styled.span`
  color: #01acbc;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
