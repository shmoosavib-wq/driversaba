import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px 0;
  padding: 0px 16px;
  height: calc(100% - 132px);
  overflow: auto;
`;

export const DescriptionPayment = styled.p`
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px 24px;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  font-weight: 400;
`;
export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
`;

export const BottomSheetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 20px 16px 0 16px;
`;

export const RatingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const RatingDetial = styled.div`
  display: flex;
  gap: 10px;
  width: 50%;
`;
export const NamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  gap: 8px 0;
`;

export const Text = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  max-width: 100%;
`;
