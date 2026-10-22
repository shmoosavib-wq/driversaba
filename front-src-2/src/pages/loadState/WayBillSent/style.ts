import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  padding: 4px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px 0;
  height: calc(100% - 132px);
  overflow: auto;
`;
export const ListButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
`;
export const ActionContainer = styled.div`
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px 0;
  text-align: center;
  padding: 16px 0;
`;

export const FirstAction = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px 0;
`;
export const SecondAction = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px 0;
`;
