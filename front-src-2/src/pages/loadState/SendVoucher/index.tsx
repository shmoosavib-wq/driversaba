import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Address from "@/components/Address";
import ButtonKit from "@/components/Button";
import CargoCancellation from "@/components/CargoCancellation";
import Typography from "@/components/Typography";
import ImageViwer from "@/components/ImageViwer";
import TrackingNumber from "@/components/TrackingNumber";
import Navbar from "@/layout/Navbar";
import SecondDriverAccordion from "@/components/SecondDriverAccordion";

import { ActionContainer, Container, Line } from "./style";

export default function SendVoucher({ data = null }) {
  const navigate = useNavigate();
  const [openImg, setOpenImg] = useState<boolean>(false);
  const Location = useLocation();
  const RowData = data ?? Location?.state;
  return (
    <Navbar
      isBackButtonVisible={data ? false : true}
      title="وضعیت بار"
      truck={RowData?.CarrierEquipmentTitle}
      OriginCity={RowData?.OriginCity}
      DestinationCity={RowData?.DestinationCity}>
      <Container>
        <img
          src="/images/loadState/sendVoucher/sendVoucher.svg"
          alt="sendVoucher"
        />
        <ActionContainer>
          <Typography
            type="LabelMedium"
            title="حواله شما با موفقیت صادر شد!"
            width="100%"
          />
          <ButtonKit
            theme="blue"
            text="مشاهده حواله"
            height="50px"
            width="46%"
            onClick={() => {
              setOpenImg(true);
            }}
          />
          <Line />
          <Typography
            type="LabelMedium"
            title="پس از بارگیری ، وزن بار را ثبت کنید"
            width="100%"
          />
          <ButtonKit
            text="ثبت وزن بارگیری"
            height="50px"
            width="46%"
            onClick={() =>
              navigate("/upload-loading-weight", {
                state: RowData?.LogisticRequestAppId,
              })
            }
          />
        </ActionContainer>
        <Address title="ادرس مبدا">{RowData?.OriginAddressContext}</Address>
        <SecondDriverAccordion
          logisticReqAppId={RowData?.LogisticRequestAppId}
          data={RowData}
        />
        <CargoCancellation
          logisticRequestAppId={RowData?.LogisticRequestAppId}
        />

        <TrackingNumber trackNumber={RowData?.LogisticRequestAppId} />
      </Container>
      {openImg && (
        <ImageViwer
          setOpenImg={setOpenImg}
          imgsrc={RowData?.VoucherPhoto}
          title="حواله"
        />
      )}
    </Navbar>
  );
}
