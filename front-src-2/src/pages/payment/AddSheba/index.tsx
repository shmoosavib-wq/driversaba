import styled from "styled-components";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { toaster } from "baseui/toast";
import { useLocation, useNavigate } from "react-router-dom";

import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";
import { InputKit } from "@/components";
import { addSheba } from "@/services/payment/payment-api";
import Toaster from "@/components/global/Toast";
import { ButtonContainer } from "@/components/Filter";
import Image from "@/components/global/Image";

interface AddShebaT {
  shebaNumber: string;
  LogisticRequestAppId: number;
}

export default function AddSheba() {
  const location = useLocation();
  const navigate = useNavigate();
  const { LogisticRequestAppId, secondDriverFullName } = location.state;
  const { mutate: addShebaNamber, isLoading } = useMutation(
    (shebaNunmber: AddShebaT) => addSheba(shebaNunmber),
    {
      onSuccess: () => {
        toaster.positive(<Toaster text={"شماره شبای شما با موفقیت ثبت شد"} />);
        navigate(-1);
      },
      onError: (res: AxiosError<{ Errors: [] }>) => {
        toaster.negative(<Toaster text={res.response?.data.Errors} />);
      },
    }
  );
  return (
    <Formik
      initialValues={{
        shebaNumber: null,
        LogisticRequestAppId: null,
      }}
      validationSchema={Yup.object({
        shebaNumber: Yup.string()
          .required("شماره شبا را وارد کنید")
          .length(24, "شماره شبا باید 24 رقم باشد"),
      })}
      onSubmit={(val: AddShebaT) => {
        let newFormaVal = "IR" + val.shebaNumber;
        addShebaNamber({ shebaNumber: newFormaVal, LogisticRequestAppId });
      }}>
      <Form>
        <AddShebaContainer>
          <Wrapper>
            <InputKit
              label="شماره شبا مقصد را وارد کنید"
              placeholder="شماره شبا (بدون IR)"
              name="shebaNumber"
              type="tell"
            />
            <Typography type="LabelSmall">
              فقط حساب های متعلق به راننده اول یا راننده دوم معتبر است
            </Typography>
            {secondDriverFullName && (
              <SecondDriverInfo>
                <Image src="/cargo/second-driver-true.svg" />
                <Typography type="LabelMedium">
                  {secondDriverFullName} راننده دوم شماست
                </Typography>
              </SecondDriverInfo>
            )}
          </Wrapper>
          <ButtonContainer>
            <ButtonKit
              theme="blue"
              width="90%"
              type="submit"
              isLoading={isLoading}>
              ثبت درخواست
            </ButtonKit>
          </ButtonContainer>
        </AddShebaContainer>
      </Form>
    </Formik>
  );
}
export const SecondDriverInfo = styled.div`
  padding: 25px 16px 25px 16px;
  border-radius: 16px;
  gap: 10px;
  display: flex;
  border: 1px solid #e8e8e8;
  width: 100%;
`;
export const AddShebaContainer = styled.div`
  padding: 0px 16px 14px 16px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;
