import styled from "styled-components";

import { StyledTable } from "baseui/table";

import { device } from "@/styles/BreakPoints";

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const VariantContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  white-space: nowrap;
  padding: 0px 8px 0px 24px;
`;

export const LinkContainer = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  border-radius: 8px;
  z-index: 0;
  border-width: 2px;
  border-style: solid;
  justify-content: flex-end;
  background-color: #f3f3f3;
  width: 100%;
  height: 48px;
  border-color: #f3f3f3;

  @media ${device.md} {
    height: 56px;
  }
`;

export const Link = styled.div`
  padding: 6px 8px;
  border-left: 1px solid #e8e8e8;
  font-size: 14px;
  font-weight: 500;
  background-color: #f3f3f3;
  color: #a6a6a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: ltr;
  max-width: calc(100% - 40px);

  @media ${device.md} {
    height: 56px;
    font-size: 16px;
  }
`;

export const InvitationTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 40px 16px 16px 16px;
`;

export const Invitation = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  text-align: center;
`;

export const InventionItemsWrapper = styled.div`
  width: 100%;
`;

export const IventionItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 8px 12px 8px;
`;

export const LabelContainer = styled.div`
  display: flex;
  gap: 6px;
`;

// Alternate row colors
export const StyledTableRow = styled(StyledTable)`
  tbody tr:nth-child(even) {
    background-color: #f7f7f7;
  }
`;
