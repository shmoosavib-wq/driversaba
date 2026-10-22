import styled, { css } from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Holder = styled.div`
  display: flex;
`;

export const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-right: 10px;
`;
export const ButtonContainer = styled.div`
  height: 48px;
  @media ${device.md} {
    height: 56px;
  }
`;
export const PureCost = styled.div`
  display: flex;
  justify-content: space-between;
  direction: rtl;
`;

export const PureCostTitle = styled.div`
  font-family: IRANSansX;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  text-align: right;
`;

export const PriceBox = styled.div`
  display: flex;
  gap: 10px;
`;
export const AcceptCarg = styled.div`
  height: 166px;
  width: 100%;

  padding: 20px 24px 16px 24px;
  gap: 10px;
  border: 1px solid #e8e8e8;
  opacity: 0px;
  position: fixed;
  bottom: 0;
  background-color: #ffff;
`;
export const ShareBox = styled.div`
  width: 100%;
  margin-top: 1rem;
`;
export const Container = styled.div`
  direction: rtl;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  padding: 0 16px 16px 16px;
  height: calc(93dvh - 80px - 150px);
  overflow-y: auto;
`;
export const CreatedTime = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: right;

  width: 100%;
  height: 24px;
  padding: 0px 0px 8px 0px;
  border-bottom: 1px solid #e8e8e8;
  margin: 10px 0px 15px 0px;
`;
export const TitleBox = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.7rem;
  gap: 6px;
`;

const truncStyle = css`
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
interface TrunceType {
  trunc?: boolean;
}
export const Typography = styled.p<TrunceType>`
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  text-align: right;
  margin-bottom: 0.625rem;

  ${({ trunc }) => trunc && truncStyle}
`;
export const Label = styled.h2`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-align: right;
  color: #01acbc;
`;
export const Title = styled(Typography)`
  color: #a6a6a6;
`;

export const CargoItem = styled.div`
  width: 50%;
  margin-bottom: 0.625rem;
`;
export const PriceLabel = styled.p`
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: right;
  color: #01acbc;
`;

export const CarrierEquipmentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
  margin-bottom: 20px;
`;

export const CarrierEquipment = styled.div`
  background-color: #f1f1f1;
  padding: 6px 12px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 500;
`;
