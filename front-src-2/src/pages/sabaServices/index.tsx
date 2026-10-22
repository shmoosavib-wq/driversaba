import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ListItemButton from "@/components/ListItemButton";
import Typography from "@/components/Typography";
import Navbar from "@/layout/Navbar";

export default function SabaServices() {
  const navigate = useNavigate();

  return (
    <Navbar title="صبا خدمت">
      <Container>
        <Typography type="HeadingXSmall">خدمات بارنامه و حواله</Typography>
        <ListItemButton
          label="درخواست حواله"
          imgSrc="/khadamat/1.svg"
          onClick={() => navigate("/remittance-request")}
        />
        <ListItemButton
          label="درخواست بارنامه"
          imgSrc="/khadamat/1.svg"
          onClick={() => navigate("/waybill-request")}
        />
      </Container>
    </Navbar>
  );
}

const Container = styled.div`
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 0;
`;
