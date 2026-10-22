import styled from "styled-components";

import Image from "@/components/global/Image";
import Typography from "@/components/Typography";
import { DescriptionRemittence } from "@/pages/loadState/WaitingRemittance/style";
import theme from "@/theme";

export default function WaitingAuthentication() {
  return (
    <Container>
      <Image
        src="/cargoStatus/waiting-remittance.svg"
        alt="waiting-authentication"
      />
      <Typography
        title="در انتظار احراز هویت"
        color={theme.colors.Gray400}
        type="LabelMedium"
      />
      <DescriptionRemittence>
        <Typography type="LabelMedium" color="#2D2D2D">
          فرایند احراز هویت شما در انتظار تایید توسط سازمان ثبت احوال می باشد و
          پس از انجام از طریق پیامک به شما اعلام می گردد
        </Typography>
      </DescriptionRemittence>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 0 12px 12px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px 0;
  margin-top: 20%;
`;
