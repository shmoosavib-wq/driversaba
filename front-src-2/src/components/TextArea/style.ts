import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const ErrorMassage = styled.img`
  position: absolute;
  top: 0%;
  left: 2%;
  color: #de1135;
  font-size: 13px;
`;

export const TextAreaContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const TextAreaLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  text-align: right;


  @media ${device.md} {
    font-size: 14px;
    font-weight: 600;
  }
`;

interface TextAreaType {
  BorderColor?: {};
}
export const TextAreaContent = styled.textarea<TextAreaType>`
  background-color: #e8e8e8;
  color: #000;
  border-radius: 8px;
  height: 15vh;
  padding: 10px;
  margin-top: 8px;
  border: ${({ BorderColor }) => BorderColor && "2px solid #de1135"};
`;
