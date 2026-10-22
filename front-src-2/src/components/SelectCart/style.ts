import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

// Start Styling
export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  width: 18rem;
  height: 15rem;
  border: 2px solid #bcbec0;
  padding: 20px;
  border-radius: 20px;
  gap: 16px 0;

  @media ${device.lg} {
    width: 20rem;
    height: 20rem;
  }
`;

type PropsImgDesc = {
  cartDescription?: string;
};
export const ImgTag = styled.img<PropsImgDesc>`
  width: ${(props) => (props.cartDescription ? "70%" : "80%")};
  height: ${(props) => (props.cartDescription ? "50%" : "90%")};
`;

export const DescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 50%;
`;

export const Description = styled.div`
  flex-direction: column;
  align-items: start;
  align-self: self-stretch;
  line-height: 1.25rem;
  font-size: 0.75rem;
  margin-bottom: 4px;
  font-weight: 400;

  @media ${device.lg} {
    line-height: 1.5rem;
    font-size: 0.85rem;
  }
`;

type PropsButtonOpacity = {
  opacity?: boolean;
};
export const DescriptionButton = styled.button<PropsButtonOpacity>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-width: 9rem;
  background-color: #01acbc;
  border-radius: 10rem;
  padding: 0.5rem 1rem;

  opacity: ${(props) => (props.opacity ? "50%" : "100%")};
`;

export const DescriptionButtonText = styled.p`
  font-size: 0.8rem;
  color: #fff;
`;
