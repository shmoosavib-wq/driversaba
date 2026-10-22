import styled from "styled-components";
export const Wrapper = styled.div`
  padding-bottom: 2rem;
`;
export const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 12px 0;
`;

export const Content = styled.div`
  width: 100%;
`;

export const HeaderRightContent = styled.p`
  font-size: 13px;
  font-weight: 600;

  @media (min-width: 340px) {
    font-size: 16px;
  }
`;

export const HeaderLeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0 5px;
`;

export const LeftContentParagraph = styled.p`
  font-size: 14px;
  font-weight: 600;

  font-size: 13px;
  font-weight: 600;

  @media (min-width: 340px) {
    font-size: 16px;
  }
`;

export const LeftContentImg = styled.img``;

export const CargoCardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-bottom: 1rem;
  text-align: center;
  border-top: 1px solid #e8e8e8;
  padding: 17px 1px 10px 1px;
  position: fixed;
  bottom: 0;
  background-color: #ffff;
`;

export const SecondDriver = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
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

export const SecondDriverIcon = styled.img``;

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
