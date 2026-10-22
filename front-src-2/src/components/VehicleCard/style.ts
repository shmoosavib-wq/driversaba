import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Label = styled.label<{ isChecked: boolean }>`
  background-color: #fff;
  direction: ltr;
  border-radius: 8px;
  border: 1.5px solid ${({ isChecked }) => (isChecked ? "black" : "#e8e8e8")};
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  width: 100%;
  height: 120px;
  margin: 5px 0;
  @media ${device.lg} {
    width: 22.5625rem;
  }
  @media (min-width: 330px) {
    padding-right: 20px;
  }
`;

export const Image = styled.img`
  //   margin-left: 7%;
`;

export const Input = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  //   position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: #fff;
  border: 2.5px solid #5e5e5e;
  border-radius: 50%;
  cursor: pointer;
  height: 1.25rem;
  outline: none;
  transition:
    background 0.2s ease-out,
    border-color 0.2s ease-out;
  width: 1.25rem;

  &:checked {
    background: #fff;
    border: 7.5px solid black;
  }
`;

export const CargoDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px 0;
  width: 50%;
  height: 30%;
  text-align: right;
`;

export const CargoName = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

export const CargoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 0 8px;
`;

export const StatusContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const StatusText = styled.div`
  color: #01acbc;
`;