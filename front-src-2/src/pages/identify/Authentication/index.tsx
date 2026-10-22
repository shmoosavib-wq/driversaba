import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toaster } from "baseui/toast";

import { postAuthentication } from "@/services/identify/identify-api";
import { InputKit } from "@/components";
import { CustomDatePicker } from "@/components";
import Toaster from "@/components/global/Toast";
import ButtonKit from "@/components/Button";

import {
  AuthenticationContainer,
  AuthenticationContent,
  ContainerDetail,
  SectionInput,
  ContainerInput,
  ContainerDatePicker,
  ContainerSubmitButton,
  Title,
} from "./style";

const isNatural = localStorage.getItem("isNatural");

const initialValues = {
  nationalId: "",
  persianBirthDate: "",
};

const validationSchema = Yup.object({
  nationalId: Yup.string()
    .matches(/^[0-9]{10}$/, "کد ملی باید 10 رقم باشد")
    .required(" "),
  persianBirthDate: Yup.string().required(" "),
});

const Authentication = ({ onNext }) => {
  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries("PROFILE");

  const [isValidDate, setIsValidDate] = useState();

  const { mutate, isLoading } = useMutation(
    (data: any) => postAuthentication(data),
    {
      onSuccess: (data: any) => {},
      onError: (error: any) => {},
    }
  );

  const onSubmit = (values: any) => {
    isValidDate &&
      mutate(values, {
        onSuccess: (res) => {
          onNext();
        },
        onError: (err: any) => {
          if (err.response && err.response.status === 400) {
            refetch();
          }
          toaster.negative(
            <Toaster type="negative" text={err.response.data.Errors} />
          );
        },
      });
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      {({ values, setFieldValue }) => (
        <Form>
          <AuthenticationContainer>
            <AuthenticationContent>
              <ContainerDetail>
                <Title>کد ملی و تاریخ تولد خود را وارد کنید</Title>
                <SectionInput>
                  <ContainerInput>
                    <InputKit
                      label="کد ملی"
                      name="nationalId"
                      maxLength={isNatural === "true" ? 10 : 11}
                      placeholder="مثلا 12345678"
                      mask="0000000000"
                      type="tel"
                    />
                  </ContainerInput>
                </SectionInput>

                <ContainerDatePicker>
                  <CustomDatePicker
                    title="تاریخ تولد"
                    onDateChange={(date) => {
                      setIsValidDate(date.isValidationDates);
                      setFieldValue("persianBirthDate", date.persianBirthDate);
                    }}
                  />
                </ContainerDatePicker>
              </ContainerDetail>

              <ContainerSubmitButton>
                <ButtonKit
                  text="ثبت و ادامه"
                  isLoading={isLoading}
                  theme="blue"
                  width="90%"
                  height="50px"
                  type="submit"
                />
              </ContainerSubmitButton>
            </AuthenticationContent>
          </AuthenticationContainer>
        </Form>
      )}
    </Formik>
  );
};

export default Authentication;
