import styled from "styled-components";

import Typography from "@/components/Typography";
import Image from "@/components/global/Image";

export default function CardMovement({ title, onClick }) {
  return (
    <MainContainer onClick={onClick}>
      <Image src="/history/gallery.svg" alt="gallery" />
      <Typography title={title} type="LabelMedium" />
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px 0;
  background-color: #f3f3f3;
  border-radius: 8px;
`;
