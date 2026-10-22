import styled from "styled-components";

import Typography from "@/components/Typography";

import { RulesArr } from "./constant";

export default function Rules() {
  return (
    <Container>
      {RulesArr.map((i, idx) => (
        <div key={idx}>
          <Typography type="HeadingMedium"> {i.heading}</Typography>
          <Typography type="ParagraphMedium">{i.list}</Typography>
        </div>
      ))}
    </Container>
  );
}

export const Container = styled.div`
  padding: 16px;
`;
