import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { addCommas } from "@persian-tools/persian-tools";

import { getMovement } from "@/services/driver/driver-api";
import NavMovementInformation from "@/pages/MovementInformation/component/NavMovementInformation";
import RandomColors from "@/components/RandomColors";
import Typography from "@/components/Typography";
import theme from "@/theme";
import ImageViwer from "@/components/ImageViwer";
import ShowPlate from "@/components/ShowPlate";
import Loading from "@/components/Loading";
import Image from "@/components/global/Image";
import { CarType } from "@/types";

import ListItemInfo from "./component/ListItemInfo";
import ListItemLabelInfo from "./component/ListItemLabelInfo";
import {
  DetailContainer,
  ListItemContainer,
  FlexContainer,
  MainContainer,
  SectionContainer,
  Wrapper,
  FlexRight,
  FlexLeft,
  FlexContent,
} from "./style";
import Rating from "./component/Rating";
import CardMovement from "./component/CardMovement";
import Drivers from "./component/Drivers";

// interface MovementInfoResponseType {
//   CarrierEquipmentTypeId: CarType;
//   [key: string]: any;
// }

export default function MovementInformation() {
  const { state } = useLocation();
  const [openImg, setOpenImg] = useState<boolean>(false);
  const [imgViwerTitle, setImgViwerTitle] = useState();
  const [photo, setPhoto] = useState();

  const { data, isLoading } = useQuery(["MovementInfo"], () =>
    getMovement(state)
  );

  const showImgHandler = (title) => {
    setOpenImg(true);
    setImgViwerTitle(title);
  };

  if (isLoading) <Loading />;

  // === enum definition for the user's authentication status ===
  const carItem = {
    type: data?.CarrierEquipmentTypeId as CarType,
  };

  return (
    <Wrapper>
      <NavMovementInformation
        OriginCity={data?.OriginCity}
        DestinationCity={data?.DestinationCity}
      />

      <MainContainer>
        <SectionContainer id="cargo">
          <ListItemInfo label="بار" imgSrc="/cargo/cargoDetail/cargo.svg" />

          <FlexContainer>
            <FlexRight width="50%">
              <ListItemLabelInfo label="نوع بار" desc={data?.Good} />
              <ListItemLabelInfo
                label="صاحب بار"
                desc={
                  <ListItemContainer>
                    <RandomColors
                      fontSize="16px"
                      fullName={data?.ProductOwnerFullName}
                      height="40px"
                      width="40px"
                    />
                    <DetailContainer>
                      <Typography
                        width="99px"
                        title={data?.ProductOwnerFullName}
                        type="LabelSmall"
                      />
                      <Rating rate={data?.ProductOwnerScore} />
                    </DetailContainer>
                  </ListItemContainer>
                }
              />
            </FlexRight>

            <FlexLeft width="50%">
              <ListItemLabelInfo label="تناژ بار" desc={data?.Tonnage} />
              <ListItemLabelInfo
                label="شرکت باربری"
                desc={
                  <ListItemContainer>
                    <Image
                      src="/cargoDetail/ownerCompany.svg"
                      alt="logistic-service"
                    />
                    <DetailContainer>
                      <Typography
                        width="99px"
                        title={data?.LogisticServiceCompanyTitle}
                        type="LabelSmall"
                      />
                      <Rating rate={data?.LogisticServiceScore} />
                    </DetailContainer>
                  </ListItemContainer>
                }
              />
            </FlexLeft>
          </FlexContainer>
        </SectionContainer>

        <SectionContainer id="payment">
          <ListItemInfo label="پرداختی" imgSrc="/cargo/cargoDetail/money.svg" />
          <FlexContainer>
            <FlexRight width="40%">
              <ListItemLabelInfo
                label="پرداختی نهایی"
                desc={
                  <FlexContent>
                    <Typography
                      title={addCommas(data?.Amount)}
                      type="LabelSmall"
                    />
                    <Typography
                      title="تومان"
                      type="LabelMedium"
                      color={theme.colors.Blue}
                    />
                  </FlexContent>
                }
              />
              {data?.prize && (
                <ListItemLabelInfo
                  label="پاداش"
                  desc={
                    <FlexContent>
                      <Typography
                        title={addCommas(data?.prize)}
                        type="LabelSmall"
                      />
                      <Typography
                        title="تومان"
                        type="LabelMedium"
                        color={theme.colors.Blue}
                      />
                    </FlexContent>
                  }
                />
              )}

              <ListItemLabelInfo
                label="حساب مقصد"
                desc={
                  <FlexContent>
                    <Image src="/history/rectangle.svg" alt="rectangle" />
                    <Typography
                      width="110px"
                      title={data?.DestinationAccount}
                      type="ParagraphMedium"
                    />
                  </FlexContent>
                }
              />
            </FlexRight>

            <FlexLeft payment width="60%">
              <ListItemLabelInfo
                label="تاریخ پرداخت"
                desc={data?.PaymentDate}
              />
              <ListItemLabelInfo
                label={
                  <div
                    style={{
                      display: "flex",
                      gap: "0 8px",
                      alignItems: "center",
                    }}>
                    <Typography
                      title={data?.DestinationAccountNumber}
                      type="ParagraphSmall"
                    />
                    <Typography
                      title={
                        data?.DestinationAccountNumber.length === 26
                          ? "شبا"
                          : "صباکارت"
                      }
                      type="LabelMedium"
                      color={theme.colors.Blue}
                    />
                  </div>
                }
              />
            </FlexLeft>
          </FlexContainer>
        </SectionContainer>

        <SectionContainer id="file">
          <ListItemInfo label="فایل ها" imgSrc="/history/file.svg" />

          <FlexContent>
            <CardMovement
              onClick={() => {
                showImgHandler("بارنامه");
                setPhoto(data?.WaybillPhoto);
              }}
              title="تصویر بارنامه"
            />
            <CardMovement
              onClick={() => {
                showImgHandler("حواله");
                setPhoto(data?.VoucherPhoto);
              }}
              title="تصویر حواله"
            />
          </FlexContent>
          <FlexContent>
            <CardMovement
              onClick={() => {
                showImgHandler("باسکول بارگیری");
                setPhoto(data?.LoadScalePhoto);
              }}
              title="تصویر باسکول بارگیری"
            />
            <CardMovement
              onClick={() => {
                showImgHandler("باسکول تخلیه");
                setPhoto(data?.UnLoadScalePhoto);
              }}
              title="تصویر باسکول تخلیه"
            />
          </FlexContent>
          {openImg && (
            <ImageViwer
              setOpenImg={setOpenImg}
              imgsrc={photo}
              title={imgViwerTitle}
            />
          )}
        </SectionContainer>

        <SectionContainer id="dateTime">
          <ListItemInfo
            label="تاریخ و زمان"
            imgSrc="/cargo/cargoDetail/date.svg"
          />
          <FlexContainer>
            <FlexRight>
              <ListItemLabelInfo
                label="تاریخ بارگیری"
                desc={data?.LoadScaleDate}
              />
            </FlexRight>
            <FlexLeft>
              <ListItemLabelInfo
                label="تاریخ تخلیه"
                desc={data?.UnLoadScaleDate}
              />
            </FlexLeft>
          </FlexContainer>
        </SectionContainer>

        <SectionContainer id="myVehicle">
          <ListItemInfo label="ناوگان" imgSrc="/cargoStatus/truck.svg" />
          <FlexContainer>
            <FlexRight width="30%">
              <Image src={`/fleets/${carItem.type}.svg`} alt="fleet" />
            </FlexRight>
            <FlexLeft width="65%">
              <Typography
                title={data?.CarrierEquipmentTitle}
                type="LabelLarge"
              />
              <ShowPlate SerialNumber={data?.LicensePlate} />
              <FlexContainer gap>
                <Typography
                  title="شماره هوشمند"
                  type="ParagraphSmall"
                  color={theme.colors.Gray400}
                />
                <Typography
                  title={data?.SmartNumber}
                  type="ParagraphSmall"
                  color={theme.colors.Blue}
                />
              </FlexContainer>
            </FlexLeft>
          </FlexContainer>
        </SectionContainer>

        <SectionContainer id="driver">
          <ListItemInfo
            label="رانندگان"
            imgSrc="/cargo/second-driver-true.svg"
          />
          <Drivers {...data} />
        </SectionContainer>
      </MainContainer>
    </Wrapper>
  );
}
