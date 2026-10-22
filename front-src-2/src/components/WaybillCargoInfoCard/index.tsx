import ShowPlate from "../ShowPlate";
import Typography from "../Typography";

import Image from "../global/Image";
import theme from "@/theme";
import {
  CardContainer,
  FlexCol,
  HeaderContent,
  DetailContainer,
  MoreDetail,
  PlateContainer,
} from "../HistoryMovementCard/style";

interface PropsType {
  item: {
    CarrierEquipmentTypeId: number;
    DestinationCity: string;
    Good: string;
    LicensePlate: string;
    LogisticRequestAppId?: number;
    OriginCity: string;
    PersianTransportTime: string;
    CreatedDate: string;
  };
}

export default function WaybillCargoInfoCard({ item }: PropsType) {
  return (
    <CardContainer>
      <FlexCol>
        <HeaderContent>
          <Typography title={item.OriginCity} type="LabelMedium" />
          <Image src="/history/vector.svg" alt="vector" />
          <Typography title={item.DestinationCity} type="LabelMedium" />
        </HeaderContent>
        <Typography
          title={item.CreatedDate}
          type="ParagraphSmall"
          color={theme.colors.Gray400}
        />
      </FlexCol>

      <FlexCol>
        <DetailContainer>
          <MoreDetail>
            <Image src="/history/product.svg" alt="product" />
            <Typography title={item.Good} type="ParagraphSmall" />
          </MoreDetail>
        </DetailContainer>
        <PlateContainer>
          <ShowPlate width="18%" SerialNumber={item.LicensePlate} />
        </PlateContainer>
      </FlexCol>
    </CardContainer>
  );
}
