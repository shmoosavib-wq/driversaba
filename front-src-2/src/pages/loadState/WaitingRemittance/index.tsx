import { useLocation } from "react-router-dom";

import Typography from "@/components/Typography";
import theme from "@/theme";
import CargoCancellation from "@/components/CargoCancellation";
import SecondDriverAccordion from "@/components/SecondDriverAccordion";
import TrackingNumber from "@/components/TrackingNumber";
import Address from "@/components/Address";
import Navbar from "@/layout/Navbar";
import Image from "@/components/global/Image";

import { MainContainer, DescriptionRemittence } from "./style";

export default function WaitingRemittance({ data = null }) {
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
          title="در انتظار حواله"
          color={theme.colors.Gray400}
          type="LabelMedium"
        />
        <DescriptionRemittence>
          حواله شما در انتظار صدور توسط شرکت باربری می باشد و صدور آن از طریق
          پیامک به شما اعلام میگردد
        </DescriptionRemittence>

        <Address title="آدرس مبدا">{RowData?.OriginAddressContext}</Address>

        <SecondDriverAccordion
          logisticReqAppId={RowData?.LogisticRequestAppId}
          data={RowData}
        />

        <CargoCancellation
          logisticRequestAppId={RowData?.LogisticRequestAppId}
        />

        <TrackingNumber trackNumber={RowData?.LogisticRequestAppId} />
      </MainContainer>
    </Navbar>
  );
}
