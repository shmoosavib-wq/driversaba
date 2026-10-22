import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const AuthenticationContainer = styled.section`
  width: 100%;
  height: 100%;
  background-color: #fff;

  @media ${device.md} {
    height: 80vh;
  }
`;

export const AuthenticationContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;

  @media ${device.md} {
    justify-content: center;
    width: 80%;
  }
  @media ${device.lg} {
    width: 70%;
  }
  @media ${device.xl} {
    width: 60%;
  }
  @media ${device.xxl} {
    width: 50%;
  }
`;

export const Title = styled.p`
  direction: rtl;
  padding: 10px 20px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;

  @media ${device.md} {
    display: none;
    opacity: 0;
    visibility: hidden;
  }
`;

export const ContainerDetail = styled.div`
  margin-top: 10px;
  height: 60dvh;
`;

export const SectionInput = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerInput = styled.div`
  margin: 0 auto;
  width: 90%;

  @media ${device.md} {
    margin-bottom: 40px;
    width: 49%;
    height: 48px;
  }
  @media ${device.lg} {
    width: 49%;
  }
`;

export const ContainerDatePicker = styled.div`
  width: 93%;
  margin: 20px auto;

  @media ${device.md} {
    width: 51%;
  }
`;

export const ContainerCropper = styled.div`
  display: flex;
  flex-direction: column;
  @media ${device.md} {
    flex-direction: row;
    gap: 0 16px;
  }
`;

export const DriverInputContainer = styled.div`
  width: 90%;
  display: flex;
  margin: 0 auto;

  @media ${device.md} {
    margin-bottom: 16px;
    width: 50%;
  }
  @media ${device.lg} {
    width: 50%;
  }
`;

export const ContainerSubmitButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: fixed;
  bottom: 10px;
  width: 100%;

  @media ${device.md} {
    width: 45%;
    height: 15%;
    align-items: end;
    margin: 0 0;
  }
  @media ${device.lg} {
    width: 48%;
  }
`;

export const SubmitButton = styled.button`
  margin: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  width: 92%;
  height: 48px;
  background-color: #01acbc;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;

  @media ${device.md} {
    position: sticky;
    width: 44%;
    border-radius: 999px;
  }
  @media ${device.lg} {
    font-size: 14px;
    width: 42%;
  }
  @media ${device.xl} {
    width: 43%;
  }
  @media ${device.xxl} {
    width: 40%;
  }

  opacity: ${({ disabled }) => (disabled ? "50%" : "100%")};
`;
