import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  padding: 0 12px 12px 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px 0;
  height: calc(100% - 132px);
  overflow: auto;
`;

export const DescriptionRemittence = styled.p`
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px 24px;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  font-weight: 400;
`;
