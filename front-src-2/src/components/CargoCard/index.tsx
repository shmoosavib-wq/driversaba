import { useNavigate } from "react-router-dom";
import { addCommas } from "@persian-tools/persian-tools";

import { CargoCartType } from "@/types";
import ButtonKit from "../Button";
import Image from "../global/Image";

import {
  ArrowLeft,
  CardContainer,
  CardItems,
  CargoDetailsContainer,
  CityContainer,
  CityName,
  CityNameContainer,
  Currency,
  Line,
  LoadTruckContainer,
  LoadTruckItem,
  PriceContainer,
  TonnageText,
  Typography,
} from "./style";

interface Props {
  item: CargoCartType;
}

export default function CargoCard({ item }: Props) {
  const navigate = useNavigate();
  return (
    <CardContainer id="load-view">
      <CardItems>
        <CityContainer>
          <Image src="/cargo/cargoCard/destination.svg" alt="destination" />

          <CityNameContainer>
            <CityName trunce>{item.OriginCity}</CityName>
            <CityName trunce>{item.DestinationCity}</CityName>
          </CityNameContainer>
        </CityContainer>
        <LoadTruckContainer>
          <LoadTruckItem>
            <Image src="/cargo/cargoCard/product.svg" alt="product" />

            <Typography trunce> {item.Good}</Typography>
          </LoadTruckItem>
          <LoadTruckItem>
            <Image src="/cargo/cargoCard/truck.svg" alt="truck" />
            {/* {item.CarrierEquipmentType?.map((item, index) => (
              <Typography key={index}> {item}</Typography>
            ))} */}
            <Typography trunce>
              {item.CarrierEquipmentType.join(",")}
            </Typography>
          </LoadTruckItem>
        </LoadTruckContainer>
      </CardItems>
      <CargoDetailsContainer>
        <PriceContainer>
          {item.HasTonnage === true ? (
            <TonnageText>هرتن</TonnageText>
          ) : (
            <TonnageText>سرویسی</TonnageText>
          )}
          <Line />
          <Typography>{addCommas(item.PureCost)}</Typography>

          <Line />
          <Currency>تومان</Currency>
        </PriceContainer>

        <ButtonKit
          theme="blue"
          width="107px"
          height="32px !important"
          fontSize="13px !important"
          onClick={() => {
            navigate("/cargoDetail", { state: item.LogisticRequestAppId });
          }}
          text={
            <>
              {"     مشاهده بار"}
              <ArrowLeft
                src="/images/cargo/cargoCard/arrowLeft.svg"
                alt="arrow"
              />
            </>
          }
        />
      </CargoDetailsContainer>
    </CardContainer>
  );
}
