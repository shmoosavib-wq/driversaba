import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Container = styled.div`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  @media ${device.lg} {
    padding: 7rem;
  }
`;

export const TextContainer = styled.div`
  direction: rtl;
  gap: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-bottom: 2rem;
  @media ${device.lg} {
    margin: auto;
    position: relative;
    left: 17%;
  }
`;

export const WarningContainer = styled.div`
  width: 100%;
  height: 42px;
  background-color: #fff8d4;
  border-radius: 12px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  margin-bottom: 10px;

  @media ${device.md} {
    height: 56px;
  }

  @media ${device.lg} {
    width: 87%;
    margin-top: 40px;
  }

  @media ${device.xl} {
    width: 56%;
  }
  @media ${device.xxl} {
    width: 52%;
  }
`;

export const WarningText = styled.p`
  color: #000;
  font-size: 11px;
  font-weight: 600;
  width: 90%;
  direction: rtl;
  // padding-right: 20px;

  @media ${device.xs} {
    font-size: 12px;
  }
  @media ${device.md} {
    font-size: 14px;
  }
`;

export const WarningIcon = styled.img`
  width: 18px;
  height: 18px;

  @media ${device.md} {
    width: 24px;
    height: 24px;
  }
`;

export const UserSelectText = styled.p`
  height: 0.75rem;
  align-self: stretch;
  display: inline-flex;
  flex-direction: column;
  font-size: 1.25rem;
`;
export const CartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  --tw-space-y-reverse: 0;
  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0px * var(--tw-space-y-reverse));
  @media ${device.lg} {
    width: 90%;
  }
  @media ${device.xl} {
    width: 62%;
  }
  @media ${device.md} {
    --tw-space-y-reverse: 0;
    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0px * var(--tw-space-y-reverse));
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
`;
