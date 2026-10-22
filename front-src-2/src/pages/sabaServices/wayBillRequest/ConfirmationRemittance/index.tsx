import { styled } from "styled-components";

import ListItemButton from "@/components/ListItemButton";
import Typography from "@/components/Typography";

export default function ConfirmationRemittance({ setWayBillState }) {
  return (
    <Container>
      <Typography type="HeadingXSmall">
        حواله خود را از صبابار دریافت کرده اید؟
      </Typography>
      <ListItemButton
        onClick={() => setWayBillState(0)}
        label="بله"
        imgSrc="/khadamat/yes.svg"
      />
      <ListItemButton
        label="خیر"
        imgSrc="/khadamat/no.svg"
        onClick={() => setWayBillState(1)}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 0;
`;
