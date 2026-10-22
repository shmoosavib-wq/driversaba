import styled from "styled-components";

export const Container = styled.section`
  width: 21rem;
  display: flex;
  flex-wrap: wrap;
  height: 90dvh;
  margin: auto;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;
export const VerificationSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px 0;
  @media (min-width: 1024px) {
    direction: ltr;
    justify-content: center;
    flex-direction: row;
    width: 50rem;
    gap: 5rem;
    flex-wrap: nowrap;

    display: flex;
    align-self: stretch;
  }
`;

export const VerificationImage = styled.img`
  margin-left: auto;
  margin-right: auto;
  width: 18rem;
  align-self: flex-end;
  @media (min-width: 768px) {
    width: 22rem;
    height: 15rem;
  }
  @media (min-width: 1024px) {
    width: 31rem;
    height: 27rem;
    align-self: auto;
  }
`;

export const VerificationContaier = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 70%;
  @media (min-width: 1024px) {
    width: 21rem;
    align-items: center;
    gap: 2.5rem;
    justify-content: center;
  }
`;

export const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  @media (min-width: 1024px) {
    width: 21rem;
  }
`;

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  gap: 0.25rem;
`;

export const EditText = styled.p`
  text-align: center;
  line-height: 2rem;
  max-width: 50ch;
  color: black;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  @media (min-width: 1024px) {
    font-size: 16px;
    text-align: right;
    line-height: 24px;
  }
`;

export const EditNumber = styled.div`
  column-gap: 0.25rem;
  color: #01acbc;
  display: flex;
  align-items: center;
`;

export const PinCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  gap: 0.75rem;
  width: 21rem;
  top: 40%;
  flex-shrink: 0;
`;
