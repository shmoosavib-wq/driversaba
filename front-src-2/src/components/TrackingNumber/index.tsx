import styled from "styled-components";

import Typography from "../Typography";

interface PropsType {
  trackNumber: number;
}

export default function TrackingNumber({ trackNumber }: PropsType) {
  return (
    <Container>
      <Typography
        type="ParagraphMedium"
        title={
          <>
            شماره پیگیری شما <TrackingCode>{trackNumber}</TrackingCode> می باشد
          </>
        }
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TrackingCode = styled.span`
  padding: 0 4px;
  color: #01acbc;
`;
