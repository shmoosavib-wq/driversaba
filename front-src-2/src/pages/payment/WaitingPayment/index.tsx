import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { toaster } from "baseui/toast";

import Typography from "@/components/Typography";
import Image from "@/components/global/Image";
import Navbar from "@/layout/Navbar";
import theme from "@/theme";
import ListItemButton from "@/components/ListItemButton";
import TrackingNumber from "@/components/TrackingNumber";
import ImageViwer from "@/components/ImageViwer";
import { StatusType } from "@/types";
import BottomSheet from "@/components/global/BottomSheet";
import ButtonKit from "@/components/Button";
import Toaster from "@/components/global/Toast";
import { submitPoll } from "@/services/payment/payment-api";
import Loading from "@/components/Loading";
import { ListButtonContainer } from "@/pages/loadState/WayBillSent/style";

import {
  BottomSheetContainer,
  ButtonWrapper,
  DescriptionPayment,
  MainContainer,
} from "./style";
import Rating from "./components/Rating";

interface SubmitPollType {
  LogisticRequestAppId: number;
  ScoreProductOwner: number;
  ScoreLogisticService: number;
}

export default function WaitingPayment({ data }: StatusType) {
  const { state } = useLocation();
  const RowData = data ?? state;
  console.log(RowData);

  const [ownerRate, setOwnerRate] = useState<number | null>(null);
  const [logisticRate, setLogisticRate] = useState<number | null>(null);
  const [openRating, setOpenRating] = useState<boolean>();
  const [openImg, setOpenImg] = useState<boolean>(false);
  const [photoTitle, setPhotoTitle] = useState<string>("");
  const [photoSrc, setPhotoSrc] = useState<string>("");

  useEffect(() => {
    setOpenRating(RowData?.HasPolled);
  }, [RowData?.HasPolled]);

  const handleOpenImage = (title: string, imgSrc: string) => {
    setPhotoSrc(imgSrc);
    setPhotoTitle(title);
    setOpenImg(true);
  };
  const { mutate: submitPollMutation, isLoading } = useMutation(
    (data: SubmitPollType) => submitPoll(data),
    {
      onSuccess: () => {
        setOpenRating(true);
        toaster.positive(<Toaster text={"نظر سنجی با موفقیت انجام شد"} />);
      },
      onError: (res: AxiosError<{ Errors: string[] }>) => {
        setOpenRating(true);
        toaster.negative(
          <Toaster text={res.response?.data.Errors.join(", ")} />
        );
      },
    }
  );
  const handleSubmitPoll = () => {
    if (ownerRate !== null && logisticRate !== null) {
      submitPollMutation({
        LogisticRequestAppId: RowData.LogisticRequestAppId,
        ScoreProductOwner: ownerRate,
        ScoreLogisticService: logisticRate,
      });
    }
  };

  return (
    <Navbar
      isBackButtonVisible={!data}
      title="وضعیت بار"
      truck={RowData?.CarrierEquipmentTitle}
      OriginCity={RowData?.OriginCity}
      DestinationCity={RowData?.DestinationCity}>
      <MainContainer>
        <Image src="/payment/waiting-payment.svg" alt="waiting-payment" />
        <Typography
          title="در انتظار پرداخت"
          type="LabelLarge"
          color={theme.colors.Gray400}
        />
        <DescriptionPayment>
          از همراهی شما با صبابار قدردانیم کرایه شما در اسرع وقت پرداخت خواهد شد
        </DescriptionPayment>
        <ListButtonContainer>
          <ListItemButton
            label="مشاهده بارنامه"
            imgSrc="/history/gallery.svg"
            onClick={() => handleOpenImage("بارنامه", RowData?.VoucherPhoto)}
          />
          <ListItemButton
            label="مشاهده حواله"
            imgSrc="/history/gallery.svg"
            onClick={() => handleOpenImage("حواله", RowData?.WayBillPhoto)}
          />
        </ListButtonContainer>
        <TrackingNumber trackNumber={RowData.LogisticRequestAppId} />
        <BottomSheet
          closeable
          onClose={() => setOpenRating(true)}
          isOpen={!openRating}
          title={`امتیاز به سیر ${RowData?.OriginCity} به ${RowData?.DestinationCity}`}>
          <BottomSheetContainer>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {" "}
                <Rating
                  imaSrc={RowData?.ProductOwnerScoreInformation?.Icon}
                  setValue={setOwnerRate}
                  value={ownerRate}
                  title="صاحب بار"
                  subTitle={RowData?.ProductOwnerScoreInformation?.FullName}
                />
                <Rating
                  imaSrc={RowData?.LogisticServiceScoreInformation?.Icon}
                  setValue={setLogisticRate}
                  value={logisticRate}
                  title="شرکت باربری"
                  subTitle={RowData?.LogisticServiceScoreInformation?.FullName}
                />
                <ButtonWrapper>
                  <ButtonKit
                    theme="black"
                    width="50%"
                    onClick={handleSubmitPoll}>
                    ثبت امتیاز
                  </ButtonKit>
                  <ButtonKit
                    theme="white"
                    width="50%"
                    onClick={() => setOpenRating(true)}>
                    بی خیال
                  </ButtonKit>
                </ButtonWrapper>
              </>
            )}
          </BottomSheetContainer>
        </BottomSheet>
        {openImg && (
          <ImageViwer
            setOpenImg={setOpenImg}
            imgsrc={photoSrc}
            title={photoTitle}
          />
        )}
      </MainContainer>
    </Navbar>
  );
}
