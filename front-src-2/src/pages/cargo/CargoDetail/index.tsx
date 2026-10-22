import { useState } from "react";
import { useQuery } from "react-query";
import { StarRating } from "baseui/rating";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { addCommas } from "@persian-tools/persian-tools";
import { RWebShare } from "react-web-share";

import ButtonKit from "@/components/Button";
import RandomColors from "@/components/RandomColors";
import {
  getAuthenticationStatus,
  getCargoDetail,
} from "@/services/driver/driver-api";
import Navbar from "@/layout/Navbar";
import Alert from "@/components/global/Alert";
import Loading from "@/components/Loading";
import { LoadingConatainer } from "@/pages/identify";
import Map from "@/components/Map";
import Image from "@/components/global/Image";
import ListItemButton from "@/components/ListItemButton";

import {
  AcceptCarg,
  Box,
  ButtonContainer,
  CargoItem,
  CarrierEquipment,
  CarrierEquipmentContainer,
  Container,
  CreatedTime,
  Holder,
  Label,
  PriceBox,
  PriceLabel,
  PureCost,
  PureCostTitle,
  ShareBox,
  Title,
  TitleBox,
  Typography,
} from "./style";

const CargoItems = ({ title, value }) => (
  <CargoItem>
    <Title>{title}</Title>
    <Typography trunc>{value}</Typography>
  </CargoItem>
);

const PriceItem = ({ title, value }) => (
  <CargoItem>
    <Title> {title} </Title>
    <PriceBox>
      <Typography>{value}</Typography>
      <PriceLabel>تومان</PriceLabel>
    </PriceBox>
  </CargoItem>
);

const OwnerName = ({ rate, name, img, title }) => (
  <CargoItem>
    <Title>{title}</Title>
    <Holder>
      {img ? (
        <img src={img} alt={name} />
      ) : (
        <RandomColors
          fullName={name}
          width="40px"
          height="40px"
          fontSize="16px"
        />
      )}
      <Box>
        <Typography trunc>{name}</Typography>
        <StarRating
          numItems={5}
          size={10}
          value={rate}
          readOnly
          overrides={{
            Root: {
              style: () => ({
                width: "80%",
                direction: "ltr",
                display: "flex",
                justifyContent: "end",
              }),
            },
          }}
        />
      </Box>
    </Holder>
  </CargoItem>
);

const LogisticName = ({ rate, name, img, title }) => {
  let ProfileImage =
    img === null ? "/images/cargoDetail/ownerCompany.svg" : img;
  return (
    <CargoItem>
      <Title>{title}</Title>
      <Holder>
        <img src={ProfileImage} alt={name} />
        <Box>
          <Typography trunc>{name}</Typography>
          <StarRating
            numItems={5}
            size={10}
            value={rate}
            readOnly
            overrides={{
              Root: {
                style: () => ({
                  width: "80%",
                  direction: "ltr",
                  display: "flex",
                  justifyContent: "end",
                }),
              },
            }}
          />
        </Box>
      </Holder>
    </CargoItem>
  );
};

export default function CargoDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const LogisticRequestAppId = searchParams.get("logisticRequestAppId")
    ? searchParams.get("logisticRequestAppId")
    : location.state;

  const [isOpen, setIsOpen] = useState(false);
  const [isEquipment, setIsEquipment] = useState(true);
  const [status, setStatus] = useState();

  const { data, isLoading } = useQuery("cargoDetail", () =>
    getCargoDetail(LogisticRequestAppId)
  );

  // === RWebShare text & url formatted ===
  const shareText =
    data?.InviteContent.split("\n").slice(0, -1).join("\n") + "\n";

  const shareUrl = data?.InviteContent.split("\n").slice(-1);

  const {
    data: driverStatus,
    isLoading: pending,
    refetch,
  } = useQuery(
    "driverStatus",
    () => getAuthenticationStatus(LogisticRequestAppId),
    {
      enabled: false,
    }
  );

  return (
    <>
      {isLoading ? (
        <LoadingConatainer>
          <Loading />
        </LoadingConatainer>
      ) : (
        <Navbar
          title="اطلاعات بار"
          DestinationCity={data.DestinationCity}
          OriginCity={data.OriginCity}>
          <Container>
            {(isEquipment === false && status === -1) ||
            (status === 2 && isEquipment === false) ? (
              <Alert
                imgSrc="/images/modal/alert.svg"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                description="شما ناوگان مرتبطی با باری که انتخاب کرده اید را ندارید
                برای ادامه ناوگانی مرتبط اضافه کنید"
                refuse
                buttonText="افزودن ناوگان"
                navigateRoute="/addVehicle"
              />
            ) : status !== -1 ? (
              <Alert
                imgSrc="/images/modal/check-list.svg"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                buttonText="تکمیل ثبت نام"
                description="برای رزرو بار ، ابتدا ثبت نام خود را تکمیل کنید"
              />
            ) : null}

            <Map
              DestinationLatitude={data.DestinationLatitude}
              DestinationLongitude={data.DestinationLongitude}
              OriginLatitude={data.OriginLatitude}
              OriginLongitude={data.OriginLongitude}
            />
            <CreatedTime>{data.LatestDetailConstruction}</CreatedTime>
            <TitleBox>
              <Image src="/cargo/cargoDetail/cargo.svg" alt="cargo" />
              <Label>بار</Label>
            </TitleBox>
            <CargoItems title="نوع بار" value={data?.Good} />
            <CargoItems
              title="تناژ بار"
              value={data?.Tonnage === 0 ? "معادل ظرفیت ناوگان" : data?.Tonnage}
            />

            <OwnerName
              name={data?.ProductOwnerFullName}
              title="صاحب بار"
              rate={5}
              img={null}
            />
            <LogisticName
              title="شرکت باربری"
              name={data.LogisticServiceCompanyTitle}
              rate={4.5}
              img={null}
            />
            <TitleBox>
              <Image src="/cargo/cargoDetail/date.svg" alt="date" />
              <Label>تاریخ و زمان</Label>
            </TitleBox>

            <CargoItems
              title="تاریخ بارگیری"
              value={data.PersianTransportTime}
            />
            <CargoItems title="شیفت بارگیری" value={data.LogisticShiftType} />

            <TitleBox>
              <Image src="/cargo/cargoDetail/money.svg" alt="money" />
              <Label>پرداختی</Label>
            </TitleBox>
            <PriceItem
              title="کرایه هر تن"
              value={addCommas(data?.UnitAmount)}
            />
            {/* <PriceItem title="انعام راننده" value={data.DriverTip} /> */}
            <PriceItem
              title="کمیسیون شرکت باربری"
              value={`%${data.LogisticServiceCommissionPercentage} معادل ${addCommas(data.LogisticServiceCommission)}`}
            />
            {/* <PriceItem
              title="کمیسیون شرکت صبابار"
              value={`%${data.AppCommissionPercentage} معادل ${addCommas(data.AppCommission)}`}
            /> */}
            <PriceItem
              title="کمیسیون راهداری"
              value={`%${data.TollCommissionPercentage} معادل ${addCommas(data.TollCommission)}`}
            />

            <TitleBox>
              <Image src="/cargo/cargoDetail/truck.jpg" alt="truck" />
              <Label>ناوگان</Label>
            </TitleBox>

            <CarrierEquipmentContainer>
              {data?.CarrierEquipmentType.map((i, idx) => (
                <CarrierEquipment key={idx}>{i}</CarrierEquipment>
              ))}
            </CarrierEquipmentContainer>

            <TitleBox>
              <Image src="/cargo/cargoDetail/description.svg" alt="money" />
              <Label>توضیحات</Label>
            </TitleBox>
            <Typography>{data.AnnouncementHallDescription}</Typography>
            <ShareBox>
              <RWebShare
                data={{
                  title: "صبا بار",
                  text: shareText,
                  url: shareUrl,
                }}>
                <ListItemButton
                  label="اشتراک گذاری بار"
                  imgSrc="/cargo/cargoDetail/artwork.jpg"
                  noBorder
                />
              </RWebShare>
            </ShareBox>
          </Container>
          <AcceptCarg>
            <PureCost>
              <PureCostTitle>صافی راننده</PureCostTitle>
              <PriceBox>
                <Typography>{addCommas(data.Amount)}</Typography>
                <PriceLabel>تومان</PriceLabel>
              </PriceBox>
            </PureCost>
            <Typography>
              صافی راننده با کسر تمامی کمسیون ها محاسبه شده و مبلغ خالص دریافتی
              توسط راننده است
            </Typography>
            <ButtonContainer>
              <ButtonKit
                width="100%"
                height="48px"
                theme="black"
                onClick={() =>
                  refetch().then((res) => {
                    let Status = res.data.Status;
                    let HasEquipment = res.data.HasEquipment;
                    setStatus(Status);
                    setIsEquipment(HasEquipment);
                    if (
                      Status !== -1 ||
                      (Status === -1 && HasEquipment === false)
                    ) {
                      setIsOpen(true);
                    } else
                      navigate("/AcceptCargo", {
                        state: LogisticRequestAppId,
                      });
                  })
                }
                text="قبول کردن بار"
                isLoading={pending}
              />
            </ButtonContainer>
          </AcceptCarg>
        </Navbar>
      )}
    </>
  );
}
