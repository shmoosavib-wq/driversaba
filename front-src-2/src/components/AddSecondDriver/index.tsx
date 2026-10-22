import { useState } from "react";
import { toaster } from "baseui/toast";
import { useMutation } from "react-query";
import { Form, Formik } from "formik";

import Toaster from "../global/Toast";
import ButtonKit from "../Button";
import Image from "../global/Image";
import InputKit from "../Input";
import BottomSheet from "../global/BottomSheet";
import { postDriverSecondInfo } from "@/services/driver/driver-api";
import { SecondDriverInfoType } from "@/types";

import { SecondDriverField } from "./formTools/constant";
import {
  initialValuesSecondDriver,
  validationSchemaSecondDriver,
} from "./formTools/formik";

import {
  AddButton,
  ButtonSheetButtonContainer,
  InputContainer,
  SecondDriver,
  SecondDriverRightContent,
  SecondDriverText,
} from "./style";

interface PropsType {
  setDriverInfo: (value: {}) => void;
  driverInfo: {
    FirstName: string;
    Id: number;
    LastName: string;
    MobileNumber: string;
    NationalCode: string;
    PersianBirthDate: string;
  };
}

export default function AddSecondDriver({
  setDriverInfo,
  driverInfo,
}: PropsType) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: secondDriverInfoFetch, isLoading: secondDriverLoading } =
    useMutation(
      (SecondDriverDetail: SecondDriverInfoType) =>
        postDriverSecondInfo(SecondDriverDetail),

      {
        onSuccess: (res: any, variables, context) => {
          setDriverInfo(res);
          setIsOpen(false);
          variables["mobileNumber"] = "";
          variables["nationalCode"] = "";
        },
        onError: (err: any) => {
          toaster.negative(
            <Toaster type="negative" text={err.response.data.Errors} />
          );
        },
      }
    );

  return (
    <>
      <SecondDriver>
        {driverInfo && driverInfo !== null ? (
          <>
            <SecondDriverRightContent>
              <Image src="/cargo/second-driver-true.svg" alt="second-driver" />
              <SecondDriverText>
                {driverInfo?.FirstName} {driverInfo?.LastName} راننده دوم شماست
              </SecondDriverText>
            </SecondDriverRightContent>

            <AddButton>
              <ButtonKit
                type="button"
                onClick={() => {
                  setDriverInfo(null);
                }}
                text="حذف"
                shape="pill"
                width="72px"
                height="42px"
                theme="red"
              />
            </AddButton>
          </>
        ) : (
          <>
            <SecondDriverRightContent>
              <Image src="/cargo/second-driver-false.svg" alt="second-driver" />
              <SecondDriverText>راننده دوم دارید ؟ </SecondDriverText>
            </SecondDriverRightContent>

            <AddButton>
              <ButtonKit
                width="75px"
                height="42px"
                type="button"
                onClick={() => setIsOpen(true)}
                text="افزودن"
                shape="pill"
              />
            </AddButton>
          </>
        )}
      </SecondDriver>

      <Formik
        onSubmit={(value) => secondDriverInfoFetch(value)}
        initialValues={initialValuesSecondDriver}
        validationSchema={validationSchemaSecondDriver}>
        <BottomSheet
          title="اطلاعات راننده دوم"
          closeable={true}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}>
          <Form id="jj">
            {SecondDriverField.map((item: any) => (
              <InputContainer key={item.id}>
                <InputKit {...item} key={item.id} name={item.name} />
              </InputContainer>
            ))}
            <ButtonSheetButtonContainer>
              <ButtonKit
                width="100%"
                height="42px"
                type="submit"
                theme="black"
                text={"افزودن راننده"}
                isLoading={secondDriverLoading}
              />
              <ButtonKit
                width="100%"
                height="42px"
                type="button"
                onClick={() => setIsOpen(false)}
                text="انصراف"
              />
            </ButtonSheetButtonContainer>
          </Form>
        </BottomSheet>
      </Formik>
    </>
  );
}
