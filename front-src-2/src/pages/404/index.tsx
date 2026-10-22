import styled from "styled-components";
import { Link } from "react-router-dom";

import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";

export default function PageNotFound() {
  return (
    <Wrapper>
      <Container>
        <Image src="/404.svg" alt="404" />
        <Typography type="LabelMedium" width="100%">
          صفحه ی مورد نظر وجود ندارد!
        </Typography>
        <Link replace to={"/"}>
          <ButtonKit theme="black" shape="pill" width="137px">
            صفحه اصلی صبابار
          </ButtonKit>
        </Link>
      </Container>
    </Wrapper>
  );
}

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  margin: auto;
  text-align: center;
  align-self: center;
`;
export const Wrapper = styled.div`
  height: 100dvh;
  width: 100%;
  display: flex;
`;
