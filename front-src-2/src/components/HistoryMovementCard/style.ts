import styled from "styled-components";

export const CardContainer = styled.div`
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 15px 12px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 20px 0;
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0 10px;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0 10px;
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0;
  align-items: start;
  width: 170px;
`;

export const MoreDetail = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0 10px;
`;

export const ButtonContainer = styled.div`
  width: 105px;
  height: 36px;
`;

export const ReqAppContainer = styled.div`
  display: flex;
  gap: 0 10px;
`;

export const PlateContainer = styled.div`
  width: 90%;
`;
