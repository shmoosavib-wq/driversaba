import styled from "styled-components";
import Select from "react-select";
import { IMaskInput } from "react-imask";

import theme from "@/theme";
import { device } from "@/styles/BreakPoints";

export const MainContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 12px;
  gap: 12px 0;
  text-align: right;
  display: flex;
  flex-wrap: wrap;
`;

export const ShowError = styled.p`
  position: absolute;
  top: 0%;
  left: 2%;
  font-size: 12px;
  color: #de1135;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: bold;
  color: #000;
  width: 100%;
`;

interface ContainerType {
  error?: boolean;
}
export const Container = styled.section<ContainerType>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #e8e8e8;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  height: 48px;

  @media ${device.md} {
    height: 56px;
  }

  border-color: ${({ error }) => (error ? theme.colors.Red : "#eee")};
`;

export const ImageContainer = styled.div`
  width: 35px;

  @media ${device.md} {
    width: 17%;
  }
`;

export const PlateImage = styled.img`
  object-fit: cover;
`;

export const PlateNumberOne = styled.div`
  width: 20%;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.sm} {
    width: 30%;
  }
`;

export const PlateChar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  text-align: center;
  margin: 0 10px;

  @media ${device.md} {
    width: 50%;
  }
`;

export const StyledSelect = styled(Select)`
  outline: none;
  border: none;
  border-radius: 8px;
  background: transparent;
  width: 100%;
  // height: 50px;
  font-size: 1rem;
  text-align: center;
  z-index: 1;
`;

export const PlateNumberTwo = styled.div`
  width: 30%;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.sm} {
    width: 30%;
  }
`;

export const PlateNumberThree = styled.div`
  position: relative;
  width: 20%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media ${device.sm} {
    width: 30%;
  }
`;

export const PlateNumberThreeLabel = styled.label`
  color: #5e5e5e;
  font-size: 11px;
  font-weight: 500;
`;

export const PlateAfterContent = styled.div`
  &::before {
    content: "";
    width: 1px;
    height: 15px;
    background-color: #aaa;
    top: 0;
    left: 0;
    display: block;
    margin-top: 4px;
  }
`;

export const PlatNum1 = styled(IMaskInput)`
  outline: none;
  border: none;
  width: 100%;
  z-index: 1;
  text-align: center;
  background-color: transparent;
`;

export const PlatNum2 = styled(IMaskInput)`
  outline: none;
  border: none;
  width: 100%;
  z-index: 1;
  text-align: center;
  background-color: transparent;
`;

export const PlatNum3 = styled(IMaskInput)`
  outline: none;
  border: none;
  width: 100%;
  z-index: 1;
  text-align: center;
  background-color: transparent;
`;
