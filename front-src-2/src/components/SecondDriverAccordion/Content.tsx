import { useState } from "react";
import { useMutation } from "react-query";
import { toaster } from "baseui/toast";
import { Formik, Form } from "formik";

import Typography from "../Typography";
import ButtonKit from "@/components/Button";
import BottomSheet from "@/components/global/BottomSheet";
import {
  postChangeAssignedSecondDriver,
  postDriverSecondInfo,
} from "@/services/driver/driver-api";
import Toaster from "@/components/global/Toast";
import { SecondDriverField } from "@/pages/cargo/AcceptCargo/formTools/constants";
import { InputKit } from "@/components";
import {
  initialValuesSecondDriver,
  validationSchemaSecondDriver,
} from "@/pages/cargo/AcceptCargo/formTools/formik";
import {
  ButtonSheetButtonContainer,
  InputContainer,
} from "@/pages/cargo/AcceptCargo/style";
import { SecondDriverInfoType } from "@/types";

import { ContentContainer } from "./style";

interface PropsType {
  item: {
    Id?: number;
    FirstName?: string;
    LastName?: string;
    MobileNumber?: string;
  };
  logisticReqAppId: number;
  setSecondDriverData: (any) => void;
}

export default function Content({
  item,
  setSecondDriverData,
  logisticReqAppId,
}: PropsType) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenRemoveDriver, setIsOpenRemoveDriver] = useState<boolean>(false);

  const { mutate: deleteSecondDriver, isLoading: deleteIsLoading } =
    useMutation(
      () =>
        postChangeAssignedSecondDriver({
          logisticRequestAppId: logisticReqAppId,
          secondDriverId: null,
        }),
      {
        onSuccess: () => {
          setSecondDriverData(null);
        },
        onError: (err: any) => {
          toaster.negative(
            <Toaster type="negative" text={err.response.data.Errors} />
          );
        },
      }
    );

  const {
    mutate: editsecondDriverInfo,
    isLoading: editSecondDriverInfoIsLoading,
  } = useMutation(
    (SecondDriverDetail: SecondDriverInfoType) =>
      postDriverSecondInfo(SecondDriverDetail),
    {
      onSuccess: (res: any, variables) => {
        postChangeAssignedSecondDriver({
          logisticRequestAppId: logisticReqAppId,
          secondDriverId: res.Id,
        });
        setSecondDriverData(res);
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
    <Formik
      initialValues={initialValuesSecondDriver}
      validationSchema={validationSchemaSecondDriver}
      onSubmit={(value) => editsecondDriverInfo(value)}>
      <ContentContainer>
        <ButtonKit
          onClick={() => setIsOpen(true)}
          text="تغییر راننده"
          width="100%"
          height="50px"
          theme="blue"
        />
        <ButtonKit
          onClick={() => setIsOpenRemoveDriver(true)}
          text="حذف راننده"
          width="100%"
          height="50px"
          theme="red"
        />
        {/* === edit second-driver information === */}
        <BottomSheet
          closeable={true}
          title="اطلاعات راننده دوم"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}>
          <Form>
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
                isLoading={editSecondDriverInfoIsLoading}
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

        {/* === remove second-driver button-sheet === */}
        <BottomSheet
          isOpen={isOpenRemoveDriver}
          onClose={() => setIsOpenRemoveDriver(false)}>
          <div style={{ padding: "0 18px" }}>
            <Typography type="LabelMedium">
              مطمئن هستید که می خواهید راننده خود را حذف کنید؟
            </Typography>
          </div>
          <ButtonSheetButtonContainer>
            <ButtonKit
              onClick={() => setIsOpenRemoveDriver(false)}
              text="انصراف"
              width="100%"
              height="50px"
            />
            <ButtonKit
              onClick={() => deleteSecondDriver()}
              text="حذف راننده"
              width="100%"
              theme="secondaryRed"
              height="50px"
              isLoading={deleteIsLoading}
            />
          </ButtonSheetButtonContainer>
        </BottomSheet>
      </ContentContainer>
    </Formik>
  );
}
