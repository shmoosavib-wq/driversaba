import styled from "styled-components";

export const SecondDriver = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 0 16px;
  margin-top: 15px;
`;

export const SecondDriverRightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

export const SecondDriverText = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #2d2d2d;
  direction: rtl;

  @media (min-width: 340px) {
    font-size: 15px;
  }
`;

export const AddButton = styled.div`
  width: 80px;
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 14px;
  margin: 10px 0;
`;

export const ButtonSheetButtonContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0 14px;
  gap: 10px 10px;
  margin-top: 20px;
`;
