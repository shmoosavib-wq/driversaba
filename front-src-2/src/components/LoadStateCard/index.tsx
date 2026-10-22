import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { useQuery } from "react-query";
import { Spinner } from "baseui/spinner";

import ButtonKit from "../Button";
import Typography from "../Typography";
import ShowPlate from "../ShowPlate";
import ImageViwer from "../ImageViwer";
import Alert from "@/components/global/Alert";

import { getSabaCart } from "@/services/payment/payment-api";
import { AlertItem, ContainerAlert } from "@/pages/loadState/Payment/style";
import Image from "../global/Image";

import {
  ButtonBox,
  Button,
  ButtonContainer,
  CardContainer,
  CardHeader,
  CityContainer,
  PlateWrapper,
  LoadingContainer,
  StateContainer,
  TruckContainer,
} from "./style";
import {
  SendVoucher,
  WaitingRemittance,
  WayBillSent,
  WayBill,
  ChosePaymentWay,
  WaitingPayment,
} from "./constant";

function getState(st) {
  let container;
  let route;
  let Text;
  let Icon;
  switch (st) {
    case 6:
      container = SendVoucher;
      route = "send-voucher";
      Text = "حواله صادر شد";
      Icon = "done";
      break;
    case 7:
    case 8:
      container = WayBill;
      route = "waybill";
      Text = "در انتظار صدور بارنامه";
      Icon = "wait";
      break;
    case 9:
      container = WayBillSent;
      route = "waybill-sent";
      Text = "بارنامه شما صادر شد";
      Icon = "done";
      break;

    case 10:
      container = ChosePaymentWay;
      route = "payment";
      Text = "روش پرداخت را انتخاب کنید";
      Icon = "payment";
      break;
    case 11:
      container = WaitingPayment;
      route = "waiting-payment";
      Text = "در انتظار پرداخت";
      Icon = "wait";
      break;
    default:
      container = WaitingRemittance;
      route = "waiting-remittance";
      Text = "در انتظار صدور حواله";
      Icon = "wait";
  }

  return {
    container,
    route,
    Text,
    Icon,
  };
}

export default function LoadStateCard({ data }) {
  const navigate = useNavigate();
  const [openImg, setOpenImg] = useState(false);
  const [openWayBillImg, setOpenWayBillImg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const LogisticRequestAppId = data.LogisticRequestAppId;
  const { refetch } = useQuery(
    ["SABACART"],
    () => getSabaCart(LogisticRequestAppId),
    {
      enabled: false,
    }
  );

  const SabaCartOnClick = () => {
    setIsLoading(true);
    refetch().then((data) => {
      if (data.data?.length === 0) {
        setOpenAlert(true);
        setIsLoading(false);
      } else if (data.data?.length > 0)
        navigate("/saba-deposit", { state: LogisticRequestAppId });
    });
  };
  const values = useMemo(() => getState(data.LoadStatus), [data.LoadStatus]);

  return (
    <>
      {isLoading && (
        <LoadingContainer>
          <Spinner
            $style={{
              position: "fixed",
              right: "0",
              top: "0",
              bottom: "0",
              left: "0",
              margin: "auto",
            }}
          />
        </LoadingContainer>
      )}
      <CardContainer>
        <CardHeader>
          <CityContainer>
            <Typography type="LabelLarge">{data.OriginCity}</Typography>
            <img src="/images/loadState/card/arrow.svg" alt="arrow" />
            <Typography type="LabelLarge">{data.DestinationCity}</Typography>
          </CityContainer>
          <ButtonKit
            shape="pill"
            theme="white"
            width="105px"
            onClick={() => {
              navigate(`/${values.route}`, { state: data });
            }}>
            اطلاعات بیشتر
          </ButtonKit>
        </CardHeader>
        <TruckContainer>
          <img src={`/images/fleets/${10}.svg`} alt="truck" />
          <PlateWrapper>
            <Typography type="LabelMedium">
              {data.CarrierEquipmentTitle}
            </Typography>
            <ShowPlate SerialNumber={data.LicensePlate} />
          </PlateWrapper>
        </TruckContainer>
        <StateContainer>
          <img src={`/images/loadState/card/${values.Icon}.svg`} alt="wait" />
          <Typography type="ParagraphMedium">{values.Text} </Typography>
        </StateContainer>

        {values.container.length >= 1 && (
          <ButtonContainer>
            {values.container.map((i, idx) => (
              <ButtonBox key={idx}>
                <Button
                  onClick={() => {
                    if (i.text === "مشاهده حواله") {
                      setOpenImg(true);
                    } else if (i.text === "مشاهده بارنامه") {
                      setOpenWayBillImg(true);
                    } else if (i.route === "saba-deposit") {
                      SabaCartOnClick();
                    } else {
                      navigate(`/${i.route}`, {
                        state: data,
                      });
                    }
                  }}>
                  <img src={i.img} alt="weight" />
                  <Typography width="100%"> {i.text}</Typography>
                </Button>
              </ButtonBox>
            ))}
          </ButtonContainer>
        )}
      </CardContainer>
      <Alert
        imgSrc={"/images/payment/cart.svg"}
        doNavigate={false}
        isOpen={openAlert}
        setIsOpen={setOpenAlert}
        buttonText="متوجه شدم"
        description={
          <ContainerAlert>
            <Typography type="ParagraphLarge">شما صباکارت ندارید</Typography>
            برای دریافت صباکارت و بهره مندی از مزایای آن می توانید به مراکز زیر
            مراجعه کنید :
            <AlertItem>
              <Image src="/payment/spot.svg" />
              معدن نگین
            </AlertItem>
          </ContainerAlert>
        }
      />
      {openImg && (
        <ImageViwer
          setOpenImg={setOpenImg}
          imgsrc={data?.VoucherPhoto}
          title="حواله"
        />
      )}
      {openWayBillImg && (
        <ImageViwer
          setOpenImg={setOpenWayBillImg}
          imgsrc={data?.WayBillPhoto}
          title="بارنامه"
        />
      )}
    </>
  );
}
