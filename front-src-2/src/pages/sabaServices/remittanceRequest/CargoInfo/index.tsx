import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useMutation } from "react-query";
import { toaster } from "baseui/toast";
import { useState } from "react";

import { AlertContent, Container, WrapperCargoInfo } from "../style";
import Typography from "@/components/Typography";
import { DropDown } from "@/components";
import ButtonKit from "@/components/Button";
import { ButtonContainer } from "@/components/Filter";
import { useSabaServiceValue } from "@/store";
import { postRemittanceRequest } from "@/services/sabaService/saba-service-api";
import Toaster from "@/components/global/Toast";
import Alert from "@/components/global/Alert";

import { CargoInfoDropDown } from "./formTools/constants";

interface CargoInfoT {
  nextStep?: () => void;
  lastProps?: boolean;
}

interface remittanceT {
  SenderId: number;
  SenderLocationId: number;
  ReceiverId: number;
  ReceiverLocationId: number;
  PackageTypeId: number;
  GoodId: number;
  NationalCode: string;
  FirstName: string;
  LastName: string;
  MobileNumber: string;
  SmartNumber: string;
  SecondDriverNationalId?: string;
  SecondDriverMobileNumber?: string;
  LicensePlate: string;
}

export default function CargoInfo({ nextStep, lastProps = false }: CargoInfoT) {
  const { setSabaServiceValue, data, resetSabaServiceValue }: any =
    useSabaServiceValue((state) => state);

  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
  const [trackingCode, setTrackingCode] = useState<boolean>();

  const { mutate: RemittanceRequest } = useMutation(
    (data: remittanceT) => postRemittanceRequest(data),
    {
      onSuccess: (data: any) => {
        setSabaServiceValue(null);
        setTrackingCode(data);
        setIsOpenAlert(true);
      },
      onError: (err: any) => {
        toaster.negative(
          <Toaster type="negative" text={err.response.data.Errors} />
        );
      },
    }
  );

  const initialValues: remittanceT = {
    SenderId: data?.SenderId,
    SenderLocationId: data?.SenderLocationId,
    ReceiverId: data?.ReceiverId,
    ReceiverLocationId: data?.ReceiverLocationId,
    PackageTypeId: data?.PackageTypeId,
    GoodId: data?.GoodId,
    NationalCode: data?.NationalCode,
    FirstName: data?.FirstName,
    LastName: data?.LastName,
    MobileNumber: data?.MobileNumber,
    SmartNumber: data?.SmartNumber,
    LicensePlate: data?.LicensePlate,
    SecondDriverNationalId: data?.SecondDriverNationalId,
    SecondDriverMobileNumber: data?.SecondDriverMobileNumber,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(val) => {
        setSabaServiceValue(val);
        if (lastProps === false && nextStep) {
          nextStep();
        } else {
          RemittanceRequest(val);
          resetSabaServiceValue();
        }
      }}>
      <Form>
        <Container>
          <Typography type="LabelLarge">اطلاعات محموله را وارد کنید</Typography>
          <WrapperCargoInfo>
            {CargoInfoDropDown.map((i, idx) => (
              <div>
                <DropDown
                  key={idx}
                  label={i.label}
                  name={i.name}
                  placeHolder="انتخاب کنید"
                  title={i.label}
                  shortURL={i.shortUrl}
                  searchAble
                />
              </div>
            ))}
          </WrapperCargoInfo>
          <ButtonContainer>
            <ButtonKit theme="blue" width="90%" type="submit">
              {lastProps === true ? "درخواست صدور حواله" : "ثبت و ادامه"}
            </ButtonKit>
          </ButtonContainer>
          <Alert
            imgSrc={"/images/modal/success.svg"}
            isOpen={isOpenAlert}
            setIsOpen={setIsOpenAlert}
            buttonText="متوجه شدم"
            navigateRoute="/saba-services"
            description={
              <AlertContent>
                <Typography width="100%" type="ParagraphLarge">
                  درخواست شما ثبت شد
                </Typography>
                <Typography type="ParagraphLarge" width="100%">
                  حواله شما از طریق پیامک برای شما ارسال خواهد شد
                </Typography>
                <Typography type="ParagraphLarge">کد پیگیری : </Typography>
                <Typography color="#01ACBC" type="ParagraphLarge">
                  {trackingCode}
                </Typography>
              </AlertContent>
            }
          />
        </Container>
      </Form>
    </Formik>
  );
}

CargoInfo.propTypes = {
  nextStep: PropTypes.func,
  lastProps: PropTypes.bool,
};

CargoInfo.defaultProps = {
  nextStep: () => {}, // Provide a default no-op function
  lastProps: false,
};
