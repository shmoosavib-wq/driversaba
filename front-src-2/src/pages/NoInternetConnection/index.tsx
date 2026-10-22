import styled from "styled-components";

import { toaster } from "baseui/toast";

import ButtonKit from "@/components/Button";
import { ButtonContainer } from "@/components/Filter";
import noInternetImage from "../../assets/images/no-internet-connection.svg";
import Toaster from "@/components/global/Toast";

export default function NoInternetConnection() {
  return (
    <Container>
      <ImageContainer>
        <img src={noInternetImage} alt="no-internet-connection" />
      </ImageContainer>

      <ButtonContainer>
        <ButtonKit theme="black" width="90%">
          تلاش مجدد
        </ButtonKit>
      </ButtonContainer>
    </Container>
  );
}

export const Container = styled.div`
  display: flex;
  margin: auto;
  justify-content: center;
  align-self: center;
  height: 100%;
`;
export const ImageContainer = styled.div`
  width: fit-content;
  height: fit-content;
  top: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;
