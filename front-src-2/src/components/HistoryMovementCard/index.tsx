import { useNavigate } from "react-router-dom";

import ShowPlate from "../ShowPlate";
import Typography from "../Typography";
import ButtonKit from "../Button";
import Image from "../global/Image";
import theme from "@/theme";
import { CarType } from "@/types";

import {
  CardContainer,
  FlexCol,
  HeaderContent,
  DetailContainer,
  MoreDetail,
  ButtonContainer,
  ReqAppContainer,
  PlateContainer,
} from "./style";

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
  cardFooter?: boolean;
}

export default function HistoryMovementCard({
  item,
  cardFooter = true,
}: PropsType) {
  const navigate = useNavigate();

  // === enum definition for the user's authentication status ===
  const carItem = {
    type: item?.CarrierEquipmentTypeId as CarType,
  };

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
          <PlateContainer>
            <ShowPlate width="18%" SerialNumber={item.LicensePlate} />
          </PlateContainer>
        </DetailContainer>
        <Image src={`/history/truck/${carItem.type}.svg`} alt="truck" />
      </FlexCol>

      {cardFooter === true && (
        <FlexCol>
          <ReqAppContainer>
            <Typography
              title="شماره بارنامه"
              type="ParagraphSmall"
              color={theme.colors.Gray400}
            />
            <Typography
              title={item.LogisticRequestAppId}
              color={theme.colors.Blue}
              type="LabelMedium"
            />
          </ReqAppContainer>
          <ButtonContainer>
            <ButtonKit
              text="اطلاعات بیشتر"
              shape="pill"
              width="105px"
              height="36px"
              fontSize="14px"
              onClick={() =>
                navigate("/movement-information", {
                  state: item.LogisticRequestAppId,
                })
              }
            />
          </ButtonContainer>
        </FlexCol>
      )}
    </CardContainer>
  );
}
