import { Form, Formik } from "formik";
import { useMutation } from "react-query";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { toaster } from "baseui/toast";
import * as Yup from "yup";
import { removeCommas } from "@persian-tools/persian-tools";

import { InputKit } from "@/components";
import ButtonKit from "@/components/Button";
import CropperImage from "@/components/CropperImage";
import Toaster from "@/components/global/Toast";
import { Weighbridge } from "@/services/driver/driver-api";
import Typography from "@/components/Typography";
import theme from "@/theme";

export default function WeigthUpload() {
  const location = useLocation();
  const navigate = useNavigate();

  const LogisticRequestAppId =
    location?.state?.LogisticRequestAppId || location.state;

  const { mutate, isLoading } = useMutation(
    (postData) => Weighbridge(postData),
    {
      onSuccess: (data) => {
        toaster.warning(<Toaster text="عملیات با موفقیت انجام شد" />);
        navigate("/?t=status");
      },
      onError: (error: any) => {
        toaster.negative(<Toaster text={error.response.data.Errors[0]} />);
      },
    }
  );

  const onSubmit = (data: any) => {
    const formdata: any = new FormData();
    console.log(data);

    for (const key in data) {
      if (key === "RealTonnage") {
        formdata.append(key, removeCommas(data[key]) / 1000);
      } else {
        formdata.append(key, data[key]);
      }
    }

    mutate(formdata);
  };

  return (
    <Formik
      initialValues={{
        RealTonnage: "",
        WeightBridgePhotoFile: "",
        LogisticRequestAppId: LogisticRequestAppId,
        IsLoading: location?.pathname.includes("upload-loading-weight")
          ? true
          : false,
      }}
      validationSchema={Yup.object().shape({
        RealTonnage: Yup.string().required("وزن بار را وارد کنید"),
        WeightBridgePhotoFile: Yup.string().required("عکس را وارد کنید"),
      })}
      onSubmit={(val) => onSubmit(val)}>
      <Form>
        <Contaier>
          <div>
            <div>
              <InputKit
                variant={
                  <Typography
                    title="کیلوگرم"
                    type="LabelMedium"
                    color={theme.colors.Blue}
                  />
                }
                type="tel"
                label="وزن بار را ثبت کنید"
                placeholder="مثلا 2300"
                name="RealTonnage"
                commas
              />
            </div>
            <CropperImage
              cropMode={false}
              name="WeightBridgePhotoFile"
              cropText={`تصویر باسکول ${location.pathname.includes("upload-loading-weight") ? "بارگیری" : "تخلیه"} را وارد کنید`}
            />
          </div>
          <ButtonKit
            theme="blue"
            width="100%"
            height="50px"
            isLoading={isLoading}
            type="submit">
            {`${location.pathname.includes("upload-loading-weight") ? "ثبت وزن بارگیری" : "ثبت وزن تخلیه"}`}
          </ButtonKit>
        </Contaier>
      </Form>
    </Formik>
  );
}

export const Contaier = styled.div`
  height: calc(100dvh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 16px;
`;
