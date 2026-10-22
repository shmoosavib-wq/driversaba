import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
import ButtonKit from "@/components/Button";
import ListItemButton from "@/components/ListItemButton";
import Address from "@/components/Address";
import TrackingNumber from "@/components/TrackingNumber";
import ImageViwer from "@/components/ImageViwer";
import Navbar from "@/layout/Navbar";

import {
  ActionContainer,
  FirstAction,
  SecondAction,
  MainContainer,
  ListButtonContainer,
} from "./style";

export default function WayBillSent({ data = null }) {
  const navigate = useNavigate();
  const [openImg, setOpenImg] = useState<boolean>(false);
  const [openWayBillImg, setOpenWayBillImg] = useState<boolean>(false);
  const Location = useLocation();
  const RowData = data ?? Location.state;
  return (
    <Navbar
      isBackButtonVisible={data ? false : true}
      title="وضعیت بار"
      truck={RowData?.CarrierEquipmentTitle}
      OriginCity={RowData.OriginCity}
      DestinationCity={RowData.DestinationCity}>
      <MainContainer>
        <ActionContainer>
          <FirstAction>
            <Typography
              title="بارنامه شما با موفقیت صادر شد!"
              type="LabelMedium"
            />
            <ButtonKit
              width="88%"
              height="50px"
              text="مشاهده بارنامه"
              theme="blue"
              onClick={() => setOpenWayBillImg(true)}
            />
          </FirstAction>
          <hr style={{ width: "86%" }} />
          <SecondAction>
            <Typography
              title="پس از تخلیه ، وزن بار را ثبت کنید"
              type="ParagraphMedium"
            />
            <ButtonKit
              width="88%"
              height="50px"
              text="ثبت وزن تخلیه"
              onClick={() =>
                navigate("/upload-unloading-weight", {
                  state: RowData.LogisticRequestAppId,
                })
              }
            />
          </SecondAction>
        </ActionContainer>

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

        <TrackingNumber trackNumber={RowData.LogisticRequestAppId} />

        {openImg && (
          <ImageViwer
            setOpenImg={setOpenImg}
            imgsrc={RowData?.VoucherPhoto}
            title="حواله"
          />
        )}
        {openWayBillImg && (
          <ImageViwer
            setOpenImg={setOpenWayBillImg}
            imgsrc={RowData?.WayBillPhoto}
            title="بارنامه"
          />
        )}
      </MainContainer>
    </Navbar>
  );
}
