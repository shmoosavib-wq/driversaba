import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { Spinner } from "baseui/spinner";
import { addCommas } from "@persian-tools/persian-tools";

import { toaster } from "baseui/toast";
import { AxiosError } from "axios";

import ListItemButton from "@/components/ListItemButton";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";
import Navbar from "@/layout/Navbar";
import { getSabaCart } from "@/services/payment/payment-api";
import Alert from "@/components/global/Alert";
import Toaster from "@/components/global/Toast";

import {
  AlertItem,
  ChosePayment,
  ContainerAlert,
  Container,
  PriceContainer,
  PriceBox,
} from "./style";

export default function Payment({ data = null }) {
  const Navigate = useNavigate();
  const location = useLocation();
  const PureCost = data?.PureCost || location?.state?.PureCost;
  const LogisticRequestAppId =
    location?.state?.LogisticRequestAppId || data?.LogisticRequestAppId;

  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refetch, error } = useQuery(
    ["SABACART"],
    () => getSabaCart(LogisticRequestAppId),
    {
      enabled: false,
    }
  );

  const SabaCartOnClick = () => {
    setLoading(true);
    refetch().then((data) => {
      if (data.data?.length === 0) {
        setOpenAlert(true);
        setLoading(false);
      } else if (data.data?.length > 0)
        Navigate("/saba-deposit", { state: LogisticRequestAppId });
    });
  };

  useEffect(() => {
    if (error instanceof AxiosError) {
      setLoading(false);
      toaster.negative(
        <Toaster type="negative" text={error.response?.data?.Errors} />
      );
    }
  }, [error]);
  return (
    <Navbar
      title="وضعیت بار"
      OriginCity="خاف"
      DestinationCity="چابهار"
      truck="وانت">
      <Container>
        <Image src="/loadState/payment.svg" alt="payment" />
        <PriceContainer>
          <Typography type="LabelMedium">مبلغ قابل پرداخت</Typography>
          <PriceBox>
            <Typography type="LabelLarge"> {addCommas(PureCost)}</Typography>
            <Typography color="#01ACBC" type="LabelMedium">
              تومان
            </Typography>
          </PriceBox>
        </PriceContainer>
        <ChosePayment>
          <Typography type="LabelMedium">روش پرداخت را انتخاب کنید</Typography>

          <ListItemButton
            label="صبا کارت"
            description="بدون کارمزد ، تا پایان امروز"
            imgSrc="/payment/bank-cart.svg"
            endEnhancer={loading ? <Spinner $color="black" /> : null}
            onClick={() => {
              SabaCartOnClick();
            }}
          />
          <ListItemButton
            label="شبا بانکی"
            description="با کارمزد ، 48 ساعته"
            imgSrc="/payment/sheba.svg"
            onClick={() => {
              Navigate("/sheba-deposit", { state: LogisticRequestAppId });
            }}
          />
        </ChosePayment>

        <Alert
          imgSrc={"/images/payment/cart.svg"}
          doNavigate={false}
          isOpen={openAlert}
          setIsOpen={setOpenAlert}
          buttonText="متوجه شدم"
          description={
            <ContainerAlert>
              <Typography type="ParagraphLarge">شما صباکارت ندارید</Typography>
              برای دریافت صباکارت و بهره مندی از مزایای آن می توانید به مراکز
              زیر مراجعه کنید :
              <AlertItem>
                <Image src="/payment/spot.svg" />
                معدن نگین
              </AlertItem>
            </ContainerAlert>
          }
        />
      </Container>
    </Navbar>
  );
}
