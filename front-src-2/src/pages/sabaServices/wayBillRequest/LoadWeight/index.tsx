import { Form, Formik } from "formik";
import styled from "styled-components";
import * as Yup from "yup";
import { toaster } from "baseui/toast";
import { useMutation } from "react-query";
import { useState } from "react";

import { InputKit } from "@/components";
import CropperImage from "@/components/CropperImage";
import Typography from "@/components/Typography";
import theme from "@/theme";
import ButtonKit from "@/components/Button";
import { useSabaServiceValue } from "@/store";
import Toaster from "@/components/global/Toast";
import { postWayBillRequest } from "@/services/sabaService/saba-service-api";
import { AlertContent } from "../../remittanceRequest/style";
import Alert from "@/components/global/Alert";

const initialValues = {
  Weight: "",
  LoadingScalePhoto: "",
};

const validationSchema = Yup.object({
  Weight: Yup.string().required(" "),
  LoadingScalePhoto: Yup.string().required(" "),
});

export default function LoadWeight({ nextStep, hasRemittanceSent }) {
  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
  const [trackingCode, setTrackingCode] = useState<boolean>();

  const { setSabaServiceValue, data, resetSabaServiceValue } =
    useSabaServiceValue((state) => state);

  const { mutate: RemittanceRequest }: any = useMutation(
    (data) => postWayBillRequest(data),
    {
      onSuccess: (data: any) => {
        setTrackingCode(data);
        setIsOpenAlert(true);
        resetSabaServiceValue();
      },
      onError: (err: any) => {
        toaster.negative(
          <Toaster type="negative" text={err.response.data.Errors} />
        );
      },
    }
  );

  const onSubmit = (val) => {
    // Create a FormData object
    const formData = new FormData();

    // Append form values to FormData
    Object.keys(val).forEach((key) => {
      formData.append(key, val[key]);
    });

    // Append data from useSabaServiceValue to FormData
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    formData.append("HasRemittanceSent", hasRemittanceSent.toString());
    // formData.append("RemittanceRequestId", "0");

    // Store the form data in state
    setSabaServiceValue(val);

    // Call the mutation
    RemittanceRequest(formData);
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      <Form>
        <Container>
          <Wrapper>
            <div>
              <InputKit
                name="Weight"
                label="وزن بار را ثبت کنید"
                placeholder="مثلا 2331"
                type="tel"
                variant={
                  <Typography
                    title="کیلوگرم"
                    type="LabelMedium"
                    color={theme.colors.Blue}
                  />
                }
              />
            </div>
            <CropperImage
              name="LoadingScalePhoto"
              cropText="تصویر باسکول بارگیری را آپلود کنید"
            />
          </Wrapper>
          <div style={{ marginTop: "20px" }}>
            <ButtonKit
              text="درخواست صدور بارنامه"
              theme="blue"
              width="100%"
              height="48px"
              type="submit"
            />
          </div>
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
                    بارنامه شما از طریق پیامک برای شما ارسال خواهد شد
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

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 16px;
`;

export const Wrapper = styled.div`
  overflow-y: auto;
  width: 100%;
  height: calc(100dvh - 159px - 100px);
`;
