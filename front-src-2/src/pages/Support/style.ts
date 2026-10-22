import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const SupportWrapper = styled.div`
  // height: 100vh;
  height: calc(100% - 50px);
  display: flex;
`;
export const SupportContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 31.875rem;
  direction: rtl;
  // margin: 1rem 0.5rem 1rem 1rem;
  padding: 16px;
  height: 17.5rem;
  @media ${device.lg} {
    margin: auto;
    padding: 0;
  }
`;
export const Typography = styled.p`
  color: #5e5e5e;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const SupportButton = styled.div`
  width: 80%;
  height: 3.75rem;
  border: 0.0625rem solid #e8e8e8;
  border-radius: 0.5rem;
  padding: 0.375rem 0.75rem 0.375rem 0.75rem;
  display: flex;
  justify-content: space-between;
  align-self: center;
  align-items: center;
`;
export const Arrow = styled.img`
  width: 24px;
  height: 24px;
`;
export const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-self: center;
  align-items: center;
  // gap: 0.625rem;
  gap: 16px 0;
  color: #2d2d2d;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const Icon = styled.img`
  width: 1.8681rem;
  height: 1.75rem;
`;
export const SupportItem = styled.div`
  display: flex;
  width: 100%;
  gap: 6px;
  align-items: center;
`;

export const DescriptionSection = styled.section`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  height: 4.75rem;
`;
