import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;

  @media ${device.md} {
    justify-content: center;
  }
`;

export const Content = styled.div`
  // overflow-y: scroll;
  padding-bottom: 150px;

  @media ${device.md} {
    padding-bottom: 10px;
  }
`;

export const ResponsiveContainer = styled.div`
  width: 100%;
  height: 100%;

  @media ${device.md} {
    width: 80%;
    display: flex;
    margin: 0 auto;
    flex-direction: row-reverse;
    gap: 0 40px;
  }

  @media ${device.lg} {
    width: 70%;
  }

  @media ${device.xl} {
    width: 60%;
  }
  @media ${device.xxl} {
    width: 50%;
  }
`;

export const DropDownContainer = styled.div`
  c

  @media ${device.md} {
    height: 48px;
    margin-bottom: 50px;
  }
`;

export const InputsContainer = styled.div`
  width: 100%;
  padding: 0 15px;
  margin-bottom: 15px;

  @media ${device.md} {
    height: 48px;
    margin-bottom: 55px;
  }
`;

export const TextAreaContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  height: 135px;
  line-height: 25px;

  @media ${device.md} {
    padding: 0;
  }
`;

export const CropperContainer = styled.div`
  width: 100%;
  margin-top: 14px;
`;

export const RightContent = styled.div`
  width: 100%;
  margin: 0 auto;

  @media ${device.md} {
    width: 50%;
  }
  @media ${device.lg} {
    width: 40%;
  }
`;

export const LeftContent = styled.div`
  // margin-top: 18px;
  width: 100%;
  direction: rtl;
  margin: 0 auto;

  @media ${device.md} {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  @media ${device.lg} {
    width: 40%;
  }
`;

export const LeftLayout = styled.div`
  width: 100%;
  height: 87%;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  gap: 10px 0;

  @media ${device.md} {
    padding: 0 0;
  }
`;

export const SubmitButtonContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 5px;

  @media ${device.md} {
    position: static;
    justify-content: flex-end;
    margin-top: 50px;
  }
`;

interface SubmitButtonType {
  isLoading?: boolean;
}
export const SubmitButton = styled.button<SubmitButtonType>`
  width: 90%;
  height: 50px;
  background-color: #01acbc;
  color: #fff;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.md} {
    border-radius: 999px;
    width: 60%;
  }

  @media ${device.lg} {
    border-radius: 999px;
    width: 50%;
  }

  @media ${device.xl} {
    border-radius: 999px;
    width: 55%;
  }

  @media ${device.xxl} {
    border-radius: 999px;
    width: 50%;
  }

  opacity: ${({ isLoading }) => (isLoading ? "50%" : "100%")};
`;
