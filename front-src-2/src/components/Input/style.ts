import { IMaskInput } from "react-imask";

import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

type PropsType = {
  isError?: boolean;
  disabled?: boolean;
};
export const InputContainer = styled.div<PropsType>`
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  border-radius: 8px;
  z-index: 0;
  border-width: 2px;
  border-style: solid;
  direction: ltr;
  color: #000;
  // gap: 0 10px;

  width: 100%;
  height: 48px;
  @media ${device.md} {
    height: 56px;
  }
  &.on-focus {
    border-color: #276ef1 !important;
  }

  &.active {
    border-color: #000 !important;
  }

  // maxLenght style
  &.active-max {
    border-color: #0e8345 !important;
  }

  &.on-blur {
    border-color: #e8e8e8 !important;
  }

  &.inactive-zero {
    border-color: #276ef1 !important;
  }

  border-color: ${({ isError }) => isError && "#de1135"};
  border-color: ${({ disabled }) => disabled && "transparent"};
  background-color: ${({ disabled }) => (disabled ? "#f3f3f3" : "#e8e8e8")};
`;

interface InputType {
  disabled: boolean;
}
export const Input = styled(IMaskInput)<InputType>`
  padding: 6px 8px;
  width: 100%;
  height: 48px;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;

  background-color: ${({ disabled }) => (disabled ? "#f3f3f3" : "transparent")};
  color: ${({ disabled }) => (disabled ? "#A6A6A6" : "#000")};
  @media ${device.md} {
    height: 56px;
    font-size: 16px;
  }
`;

export const LabelContainer = styled.div`
  direction: rtl;
`;

interface LabelType {
  disabled?: boolean;
}
export const Label = styled.label<LabelType>`
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  direction: rtl;

  @media ${device.md} {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }
  margin-right: 6px;

  color: ${({ disabled }) => (disabled ? "#a6a6a6" : "#2d2d2d")};
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: end;
  padding-top: 8px;
  gap: 0 8px;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0 8px;
  margin: 0 12px;
`;

type PropsTypeImg = {
  showDeleteButton?: boolean;
};
export const InputClear = styled.img<PropsTypeImg>`
  width: 15px;
  height: 15px;
  cursor: poiner;

  display: ${({ showDeleteButton }) => (showDeleteButton ? "block" : "none")};
`;
