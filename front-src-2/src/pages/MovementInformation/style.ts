import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px 0;
  padding: 20px 16px;
  height: calc(100% - 141px);
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const ListItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0 12px;
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px 0;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0;
  scroll-margin-top: 20px;
`;

interface FlexContainerType {
  gap?: any;
}
export const FlexContainer = styled.div<FlexContainerType>`
  display: flex;
  justify-content: space-between;

  gap: ${({ gap }) => gap && "0 8px"};
`;

interface FlexType {
  payment?: any;
  width?: any;
}
export const FlexRight = styled.div<FlexType>`
  display: flex;
  flex-direction: column;
  gap: 12px 0;

  width: ${({ width }) => (width ? width : "50%")};
  align-items: ${({ payment }) => (payment ? "center" : "start")};
  justify-content: ${({ payment }) => (payment ? "space-between" : "normal")};
  margin-bottom: ${({ payment }) => (payment ? "10px" : "0")};
`;

export const FlexLeft = styled.div<FlexType>`
  display: flex;
  flex-direction: column;
  gap: 12px 0;
  justify-content: space-between;

  width: ${({ width }) => (width ? width : "50%")};
  align-items: ${({ payment }) => (payment ? "center" : "start")};
  margin-bottom: ${({ payment }) => (payment ? "10px" : "0")};
`;

export const FleetContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0 12px;
`;

export const Wrapper = styled.div`
  height: 100dvh;
`;

export const FlexContent = styled.div`
  display: flex;
  gap: 0 12px;
`;
