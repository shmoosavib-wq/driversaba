import Lottie from "lottie-react";
import styled from "styled-components";

// import animationData from "@/assets/YWsyWphyYl.json";
import animationData from "@/assets/app-animation.json";

import "./style.css"

export default function Animation() {
  return (
    <Container>
      <AnimationParent id="animate">
        <Lottie animationData={animationData} />
      </AnimationParent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  margin: 0 auto;
  backdrop-filter: blur(3px);
  background-color: rgb(200 200 200 / 40%);
`;

const AnimationParent = styled.div`
  width: 104px;
  height: 104px;
  border-radius: 24px;
  border: 1px solid #e7e7e7;
  background-color: #fff;
`;
