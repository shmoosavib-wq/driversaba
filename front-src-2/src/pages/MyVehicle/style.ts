import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

// === MyVehicle - Style ====
export const AccordionContainer = styled.div`
  width: 100%;
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  gap: 12px 0;
  padding-bottom: 100px;
  height: calc(100dvh - 70px);
  overflow-y: auto;
`;

export const StatusContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100dvh;
`;

export const StatusText = styled.div`
  color: #01acbc;
`;

export const EmptyDataPlaceholder = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 20px;
  justify-content: center;
  @media ${device.xs} {
    width: 30%;
  }
`;

export const AddVehicleButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 155px;
  margin-top: 100px;

  @media ${device.md} {
    width: 166px;
  }
`;

// === Content - Style ====
export const ContentContainer = styled.div`
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
`;

export const ContentItems = styled.ul`
  width: 100%;
`;

export const ContentItem = styled.li`
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:nth-child(4) {
    border: none;
  }
`;

export const ContentLabel = styled.li`
  font-size: 14px;
  font-weight: 600;
`;

export const ContentValue = styled.li`
  font-size: 14px;
  font-weight: 400;
`;

export const ButtonFlex = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0 15px;
  margin-top: 20px;
`;

export const SheetTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

export const SheetText = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin-top: 12px;
`;

export const SheetContainer = styled.div`
  width: 90%;
  direction: rtl;
  margin: 0 auto;
  // padding-top: 15px;
`;

export const SheetButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0 10px;
  margin-top: 24px;
`;

// === Title - Style ===
export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0 10px;
`;

export const TextLabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0 10px;
`;

export const TextLabel = styled.p`
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
`;

export const AccordionImg = styled.img`
  width: 114px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  text-align: right;
`;

export const PlateContainer = styled.div`
  width: 120px;
  height: 40px;

  @media (min-width: 340px) {
    width: 165px;
  }
  @media (min-width: 380px) {
    width: 190px;
  }
`;
