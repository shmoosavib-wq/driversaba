import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const PlateNumber = styled.div`
  width: 100%;
  border: 1px solid #08319c;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 0 8px;
`;

export const PlateIran = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25%;

  & div:nth-child(1) {
    font-size: 10px;
    font-weight: 500;
  }
  & div:nth-child(2) {
    font-size: 12px;
    font-weight: 700;
  }

  @media (min-width: 340px) {
    & div:nth-child(1) {
      font-size: 12px;
      font-weight: 500;
    }
    & div:nth-child(2) {
      font-size: 13px;
      font-weight: 700;
    }
  }
`;

export const PlateIranText = styled.div`
  color: #5e5e5e;
`;

export const PlateFlex = styled.div`
  text-align: center;
  width: 25%;
  font-size: 12px;
  font-weight: 700;
  color: #5e5e5e;

  @media (min-width: 340px) {
    font-size: 15px;
  }
`;

export const PlateChar = styled.div`
  text-align: center;
  width: 10%;
  font-size: 12px;
  font-weight: 700;
  color: #5e5e5e;

  @media (min-width: 340px) {
    font-size: 15px;
  }
`;

interface PlateImgType {
  width: string;
}
export const PlateImg = styled.img<PlateImgType>`
  width: ${({ width }) => (width ? width : "100")};
`;
