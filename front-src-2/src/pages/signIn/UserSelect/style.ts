import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  background-color: #fff;
  position: absolute;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @media ${device.md} {
    align-items: center;
  }
`;

export const GenuinelegalDiv = styled.div`
  width: 100%;
`;

export const TitleDiv = styled.div`
  text-align: right;
  padding: 32px;
  display: flex;
  justify-content: flex-start;
  margin: auto;

  @media ${device.md} {
    width: 92%;
    padding: 8px;
  }
  @media ${device.lg} {
    width: 60%;
  }
  @media ${device.xl} {
    width: 60%;
  }
  @media ${device.xxl} {
    width: 50%;
  }
`;

export const CartContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  gap: 16px 0;
  display: flex;
  flex-direction: column;

  @media ${device.md} {
    gap: 0 0;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  @media ${device.lg} {
    width: 70%;
    height: 75vh;
  }
  @media ${device.xl} {
    width: 70%;
    height: 75vh;
  }
  @media ${device.xxl} {
    width: 43%;
  }
`;

export const Text = styled.p`
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.25px;
  text-align: right;
`;
