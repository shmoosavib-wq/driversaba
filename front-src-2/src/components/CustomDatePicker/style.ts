import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const customDatePickerStyles: any = {
  control: (provided: {}) => ({
    // ...provided,
    display: "flex",
    paddingBlock: 5,
    fontSize: 14,
    border: "transparent",
    backgroundColor: "transparent",
    borderColor: "transparent",
  }),
  option: (provided: {}, { data, isDisabled, isFocused, isSelected }) => ({
    ...provided,
    fontSize: 14,
    backgroundColor: isSelected ? "#E8E8E8" : isFocused ? "#E8E8E8" : "#fff",
    color: "#000",
  }),
  menu: (provided: {}, { data, isDisabled, isFocused, isSelected }) => ({
    ...provided,
    zIndex: 4,
  }),
};


export const customCharPlateStyles: any = {
  control: (provided: {}) => ({
    // ...provided,
    display: "flex",
    paddingBlock: 5,
    // fontSize: 14,
    border: "transparent",
    backgroundColor: "transparent",
    borderColor: "transparent",
  }),
  option: (provided: {}, { data, isDisabled, isFocused, isSelected }) => ({
    ...provided,
    fontSize: 14,
    backgroundColor: isSelected ? "#E8E8E8" : isFocused ? "#E8E8E8" : "#fff",
    color: "#000",
  }),
  menu: (provided: {}, { data, isDisabled, isFocused, isSelected }) => ({
    ...provided,
    zIndex: 4,
  }),
};

export const MainContainerSelect = styled.div`
  position: relative;
  width: 80%;
`;

export const ErrorParagraphSelect = styled.p`
  position: absolute;
  bottom: -30%;
  right: 0%;
  font-size: 11px;
  color: #de1135;
  width: 100%;
  direction: rtl;

  @media ${device.sm} {
    bottom: -40%;
  }
  @media ${device.lg} {
    font-size: 12px;
  }
`;

export const ErrorParagraph = styled.p`
  position: absolute;
  // top: -30%;
  // top: 0;
  // left: 16%;
  direction: rtl;
  right: 0;
  bottom: -40%;
  font-size: 10px;
  color: #de1135;
  width: 100%;

  @media ${device.sm} {
    bottom: -50%;
  }
  @media ${device.md} {
    font-size: 11px;
  }
  @media ${device.lg} {
    font-size: 12px;
  }
`;

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 8px;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0 8px;
`;

export const DatePickerDiv = styled.div`
  background-color: #e8e8e8;
  border-radius: 8px;
  width: 40px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.sm} {
    width: 48px;
    height: 48px;
  }
`;

export const DatePickerImg = styled.img`
  position: absolute;
  height: 24px;
  width: 24px;

  @media ${device.sm} {
    height: 28px;
    width: 28px;
  }

  @media ${device.md} {
    height: 30px;
    width: 30px;
  }
`;

export const DropDownContainerSelect = styled.div`
  width: 100%;
`;

export const DropDownContainer = styled.div`
  background-color: #e8e8e8;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media ${device.sm} {
    height: 48px;
  }
`;

export const Span = styled.span`
  color: #a6a6a6;

  &:after {
    content: "|";
  }
`;

export const DatePickerTitle = styled.p`
  direction: rtl;
  margin-bottom: 4px;
  margin-right: 12px;
  font-size: 13px;
  font-weight: 600;
`;

export const ShowErrorContainer = styled.div`
  margin-right: 15px;
  margin-top: 8px;
`;

export const ErrorImg = styled.img`
  margin-left: 12px;
`;

export const ErrorContainer = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-right: 10px;
`;
