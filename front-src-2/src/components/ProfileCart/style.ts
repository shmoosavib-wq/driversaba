import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const CartContainer = styled.div`
  background-color: #f3f3f3;
  border-radius: 8px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px 0;
`;

export const CartImg = styled.img``;

export const CartDescription = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #2d2d2d;
  margin-top: 4px;

  @media ${device.xs} {
    font-size: 12px;
  }
`;
