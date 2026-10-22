import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Navbar from "@/layout/Navbar";
import Typography from "@/components/Typography";
import theme from "@/theme";
import ListItemButton from "@/components/ListItemButton";
import Address from "@/components/Address";
import SecondDriverAccordion from "@/components/SecondDriverAccordion";
import TrackingNumber from "@/components/TrackingNumber";
import ImageViwer from "@/components/ImageViwer";
import Image from "@/components/global/Image";
import { ListButtonContainer } from "../WayBillSent/style";

import { MainContainer, DescriptionRemittence } from "./style";

export default function WayBill({ data = null }) {
  const [openImg, setOpenImg] = useState<boolean>(false);
  const Location = useLocation();
  const RowData = data ?? Location.state;
  return (
    <Navbar
      isBackButtonVisible={data ? false : true}
      title="وضعیت بار"
      truck={RowData?.CarrierEquipmentTitle}
      OriginCity={RowData?.OriginCity}
      DestinationCity={RowData?.DestinationCity}>
      <MainContainer>
        <Image
          src="/cargoStatus/waiting-remittance.svg"
          alt="waiting-remittance"
        />
        <Typography
          title="در انتظار بارنامه"
          color={theme.colors.Gray400}
          type="LabelMedium"
        />
        <DescriptionRemittence>
          <Typography
            title="بارنامه شما در انتظار صدور توسط شرکت باربری می باشد و صدور آن از
              طریق پیامک به شما اعلام میگردد"
            type="ParagraphMedium"
          />
        </DescriptionRemittence>

        <ListButtonContainer>
          <Link
            to={`tel:${RowData.ReceiverMobileNumber}`}
            style={{ width: "100%" }}>
            <ListItemButton label="تماس با مقصد" imgSrc="/loadState/call.svg" />
          </Link>

          <ListItemButton
            label="مشاهده حواله"
            imgSrc="/loadState/remittence.svg"
            onClick={() => setOpenImg(true)}
          />
        </ListButtonContainer>

        <Address title="آدرس مقصد">{RowData.OriginAddressContext}</Address>

        <SecondDriverAccordion
          logisticReqAppId={RowData.LogisticRequestAppId}
          data={RowData}
        />

        <TrackingNumber trackNumber={RowData.LogisticRequestAppId} />

        {openImg && (
          <ImageViwer
            setOpenImg={setOpenImg}
            imgsrc={RowData.VoucherPhoto}
            title="حواله"
          />
        )}
      </MainContainer>
    </Navbar>
  );
}
