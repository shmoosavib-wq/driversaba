import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  height: 100dvh;
  --nav-height: 167px;
  // overflow-x: hidden;
`;
export const FilterButton = styled.div`
  position: absolute;
  left: 16px;
  z-index: 1;
  margin-top: 8px;
  top: var(--nav-height);
`;

export const CardContainer = styled.div`
  width: 100%;
  height: calc(100% - var(--nav-height) - var(--bottom-tab-size));
  overflow: auto;
  padding: 0px 16px 32px 16px;
`;
export const ButtonContent = styled.div`
  display: flex;
  gap: 8px;
`;
export const EmptyDataContainer = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px 0;
`;

export const EmptyDataText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #5e5e5e;
`;

export const NetworkContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px 0;
`;

export const NetworkText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #5e5e5e;
`;

export const ScrollLoadingContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

export const TitleCotainerCard = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  background-color: #fff;
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-self: center;
`;
