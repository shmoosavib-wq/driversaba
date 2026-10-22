import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px 0;
  padding: 0px 16px;
`;
export const AlertContent = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  gap: 10px;
`;
export const Description = styled.div`
  display: flex;
  gap: 12px;
`;
export const DescriptionIcon = styled.div`
  width: 10px;
  height: 48px;
  background-color: #01acbc;
  border-radius: 5px 0px 0px 5px;
`;

export const WrapperDriverInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100dvh - 90px - 200px);
  overflow-y: auto;
`;

export const WrapperVehicleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  height: calc(100dvh - 180px - 130px);
`;

export const WrapperAddressInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100dvh - 159px - 130px);
  overflow-y: auto;
`;

export const WrapperCargoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  width: 100%;
  height: calc(100dvh - 159px - 160px);
  padding-bottom: 10px;
`;

export const PlateContainer = styled.div`
  direction: ltr;
`;
export const FullName = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`;

// driver info
// export const Wrapper = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
//   height: fit-content;
// `;
