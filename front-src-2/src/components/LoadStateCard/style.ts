import styled from "styled-components";

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
`;
export const Button = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
`;
export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  border: 1.4px solid #e8e8e8;
  border-radius: 16px;
  padding: 16px;
`;
export const CardHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
export const CityContainer = styled.div`
  display: flex;
  gap: 9px;
  align-self: center;
`;
export const TruckContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export const PlateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0;
  align-items: start;
  width: 50%;
`;
export const LoadingContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
export const StateContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 6px;
`;
export const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 8px;
  height: 80px;
  background-color: #f3f3f3;
  width: 100%;
  gap: 16px; // Space between buttons
  & > button {
    flex: 1; // Each button takes equal space
  }
`;
