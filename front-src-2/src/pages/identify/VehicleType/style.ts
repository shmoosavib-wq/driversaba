import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  border-top: 1px solid #e8e8e8;
  margin-bottom: 1rem;
  width: 100%;
  padding: 17px 1px 10px 1px;
  background-color: #ffff;

  margin: auto;
  align-content: center;
  align-items: center;
  text-align: center;
  left: 0;
  @media ${device.lg} {
    border: none;
    position: relative;
    margin-right: 13.7rem;
    height: auto;
    width: 19%;
    display: flex;
    align-items: end;
    margin-top: 3.75rem;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  direction: rtl;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;

  // overflow: scroll;
  // margin-bottom: 53px;
  @media ${device.lg} {
    gap: 20px;
  }
`;

interface VehicleTypeSectionProps {
  routeStyle?: boolean;
}
export const VehicleTypeSection = styled.div<VehicleTypeSectionProps>`
  ${({ routeStyle }) =>
    routeStyle &&
    `
      height: calc(100dvh - 180px - 90px);
      overflow-y: auto;
    `}

  @media ${device.lg} {
    margin: auto;
  }
`;
export const Container = styled.div`
  width: 100%;
  margin: auto;

  height: 100%;

  @media ${device.lg} {
    width: 46.775rem;
    height: 80vh;
    display: flex;
  }
`;
export const Text = styled.p`
  font-size: 0.75rem;
  line-height: 1.75rem;
  font-weight: 600;
  text-align: right;
  margin: 1rem;
  @media ${device.xs} {
    font-size: 1.25rem;
  }
`;
