import styled, { css } from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Line = styled.div`
  border-left: 0.7px solid #f3f3f3;
  height: 44%;
  margin: auto;
`;
export const ArrowLeft = styled.img`
  margin-right: 8px;
`;
export const TonnageText = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 23.8px;
  text-align: center;
  color: #01acbc;
`;
export const PriceContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 2px 8px 2px 8px;
  height: 28px;
  text-align: center;
`;
export const Currency = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 23.8px;
  text-align: center;
  color: #01acbc;
`;

// Define styled components
export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 163px;
  max-height: 183px;
  gap: 0px;
  border-radius: 16px;
  border: 1.4px solid #e8e8e8;
  margin-bottom: 12px;
  max-width: 462px;
  @media ${device.sm} {
    width: 462px;
  }
`;

export const CardItems = styled.div`
  margin: auto;
  display: flex;

  padding: 15px 0px 5px 0px;
  width: 100%;
  @media ${device.xs} {
    padding: 15px 20px 5px 10px;
  }
`;

const trunceStyle = css`
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
interface TrunceType {
  trunce?: boolean;
}
export const Typography = styled.p<TrunceType>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;

  ${({ trunce }) => trunce && trunceStyle}
`;

export const CityContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 53%;
  height: 81px;
  gap: 1px;
`;
export const CityNameContainer = styled.div`
  width: 50%;
  margin-top: 27px;
  margin-right: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
export const CityName = styled.div<TrunceType>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
  ${({ trunce }) => trunce && trunceStyle}
`;

export const LoadTruckContainer = styled.div`
  height: 50px;
  margin: auto;
  width: 50%;
  margin-top: 26px;
  display: flex;
  flex-wrap: wrap;
`;
export const LoadTruckItem = styled.div`
  display: flex;
  gap: 11px;
  width: 100%;
  margin: auto;
`;

export const CargoDetailsContainer = styled.div`
  padding: 11px 9px 9px 9px;

  display: flex;
  justify-content: space-between;
  width: 88%;
  border-top: 1px solid #f3f3f3;
  margin: auto;
`;
