import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const FlexButton = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 90%;
  margin: auto;
  gap: 0.75rem;
  @media ${device.lg} {
    flex-wrap: nowrap;
    gap: 1.25rem;
    width: 100%;
  }
`;
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
  @media ${device.md} {
    width: 30%;
  }
  @media ${device.lg} {
    border: none;
    position: relative;

    direction: ltr;
    height: auto;
    margin: 0;
    display: flex;
  }
`;
export const VehicleForm = styled.div`
  @media ${device.lg} {
    margin: auto;
  }
`;

export const PlateContainer = styled.div`
  direction: ltr;
  width: 100%;

  @media ${device.lg} {
    height: 4.2rem;
  }
`;

export const FlexCol = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  margin: auto;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  @media ${device.lg} {
    flex-wrap: nowrap;
    gap: 2rem;
    width: 100%;
    margin-top: 1.5rem;
  }
`;
export const VehicleContainer = styled.div`
  direction: rtl;
  display: contents;

  @media ${device.lg} {
    width: 44.5rem;
    display: block;
  }
`;

interface ContainerProps {
  routeStyle?: boolean;
}
export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin: auto;
  margin-top: 1.5rem;
  overflow-y: auto;

  height: ${({ routeStyle }) =>
    routeStyle ? "calc(100dvh - 190px - 90px)" : "calc(100dvh - 60px - 100px)"};

  @media ${device.lg} {
    width: 46.375rem;
    height: 80vh;
    display: flex;
    margin-top: 0;
  }
`;

export const InputContainer = styled.div`
  width: 21.8rem;
  height: 2.25rem;
`;
