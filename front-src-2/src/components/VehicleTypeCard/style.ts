import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Label = styled.label<{ isChecked: boolean }>`
  background-color: #fff;
  direction: ltr;
  border-radius: 8px;
  border: 1.5px solid ${({ isChecked }) => (isChecked ? "black" : "#e8e8e8")};
  position: relative;
  display: block;
  width: 90%;
  height: 5rem;
  @media ${device.lg} {
    width: 22.5625rem;
  }
`;

export const Image = styled.img`
  margin-left: 7%;
`;

export const Input = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  position: absolute;
  top: 1.6rem;
  right: 1.5rem;
  background: #fff;
  border: 3px solid #5e5e5e;
  border-radius: 50%;
  cursor: pointer;
  height: 1.625rem;
  outline: none;
  transition:
    background 0.2s ease-out,
    border-color 0.2s ease-out;
  width: 1.625rem;

  &:checked {
    background: #fff;
    border: 9px solid black;
  }
`;

export const VehicleName = styled.span`
  position: absolute;
  top: 1.6rem;
  right: 4.1rem;
`;
