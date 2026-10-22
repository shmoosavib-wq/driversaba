import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const NavSupport = styled.p`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
export const Box = styled.div`
  display: flex;
  gap: 10px;
`;
export const LocationContainer = styled.div`
  display: flex;
  gap: 8px;
  align-self: center;
  margin-bottom: 10px;
`;

export const Distonation = styled.div`
  height: 30px;
  display: flex;
`;

export const NavTitle = styled.p`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.9rem;
  line-height: 2rem;
  font-weight: 600;
`;
export const StepperContainer = styled.div`
  width: 100%;
  @media ${device.lg} {
    width: 50rem;
    margin: auto;
  }
`;

export const NavItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

export const NavContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
`;

export const Nav = styled.div`
  display: flex;
  width: 100%;
  min-height: 3rem;
  height: fit-content;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.56rem;
  padding-bottom: 0.56rem;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.14);
  margin-bottom: 0.9375rem;
  direction: rtl;
`;

export const DistonationAndTruck = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 16px 0;
  padding: 12px 0;
`;

export const Section = styled.div`
  display: flex;
  gap: 0 10px;
  font-size: 14px;
  font-weight: 400;
`;

export const LocationLabel = styled.div`
  display: flex;
  gap: 0 8px;
`;

export const SupportContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 0;
  padding: 16px 4px 0 4px;
`;
