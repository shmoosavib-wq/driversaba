import { useEffect, useState } from "react";
import { Form, Formik } from "formik";

import * as Yup from "yup";

import { InputKit } from "@/components";
import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";

import { Container, FullName, WrapperDriverInfo } from "../style";
import { ButtonContainer } from "@/components/Filter";
import { useSabaServiceValue } from "@/store";
import AddSecondDriver from "@/components/AddSecondDriver";

export default function DriverInfo({ nextStep }) {
  const { setSabaServiceValue } = useSabaServiceValue((state) => state);

  const [secondDriverInfo, setSecondDriverInfo] = useState(null);

  return (
    <Formik
      initialValues={{
        NationalCode: null,
        FirstName: null,
        LastName: null,
        MobileNumber: null,
        SecondDriverNationalId: null,
        SecondDriverMobileNumber: null,
      }}
      validationSchema={Yup.object().shape({
        NationalCode: Yup.string()
          .matches(/^[0-9]{10}$/, "کد ملی باید 10 رقم و عدد باشد")
          .required(" "),
        FirstName: Yup.string().required(" "),
        LastName: Yup.string().required(" "),
        MobileNumber: Yup.string()
          .matches(/^09([0-9]){9}$/, "شماره همراه وارد شده معتبر نیست")
          .required(" "),
      })}
      onSubmit={(val) => {
        setSabaServiceValue(val);
        nextStep();
      }}>
      {({ setFieldValue }) => {
        useEffect(() => {
          if (secondDriverInfo) {
            setFieldValue(
              "SecondDriverNationalId",
              secondDriverInfo.NationalCode
            );
            setFieldValue(
              "SecondDriverMobileNumber",
              secondDriverInfo.MobileNumber
            );
          }
        }, [setFieldValue, secondDriverInfo]);

        return (
          <Form>
            <Container>
              <Typography type="LabelLarge">
                اطلاعات راننده را وارد کنید
              </Typography>
              <WrapperDriverInfo>
                <div>
                  <InputKit
                    type="tell"
                    label="کد ملی"
                    placeholder="مثلا 0012345678"
                    name="NationalCode"
                    mask="0000000000"
                  />
                </div>
                <FullName>
                  <Typography width="100%" type="LabelMedium">
                    نام و نام خانوادگی
                  </Typography>
                  <span style={{ width: "27%" }}>
                    <InputKit placeholder="نام" name="FirstName" />
                  </span>
                  <span style={{ width: "70%" }}>
                    <InputKit placeholder="نام خانوادگی" name="LastName" />
                  </span>
                </FullName>
                <div>
                  <InputKit
                    label="شماره موبایل"
                    placeholder="مثلا 09123456789"
                    name="MobileNumber"
                    type="tell"
                    mask="00000000000"
                  />
                </div>
                <AddSecondDriver
                  setDriverInfo={setSecondDriverInfo}
                  driverInfo={secondDriverInfo}
                />
              </WrapperDriverInfo>
              <ButtonContainer>
                <ButtonKit theme="blue" width="90%" type="submit">
                  ثبت و ادامه
                </ButtonKit>
              </ButtonContainer>
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
}
