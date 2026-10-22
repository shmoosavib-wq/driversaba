import { useState } from "react";
import { useMutation } from "react-query";
import { Form, Formik } from "formik";
import { toaster } from "baseui/toast";

import AccordionKit from "../Accordion";
import Typography from "../Typography";
import ListItemButton from "../ListItemButton";
import BottomSheet from "@/components/global/BottomSheet";
import ButtonKit from "@/components/Button";
import { InputKit } from "@/components";
import {
  ButtonSheetButtonContainer,
  InputContainer,
} from "@/pages/cargo/AcceptCargo/style";
import { SecondDriverField } from "@/pages/cargo/AcceptCargo/formTools/constants";
import {
  postChangeAssignedSecondDriver,
  postDriverSecondInfo,
} from "@/services/driver/driver-api";
import Toaster from "@/components/global/Toast";
import {
  initialValuesSecondDriver,
  validationSchemaSecondDriver,
} from "@/pages/cargo/AcceptCargo/formTools/formik";

import Title from "./Title";
import Content from "./Content";
import { SecondDriverContainer, AccordionContainer } from "./style";
import "./style.css";

export default function SecondDriverAccordion({ logisticReqAppId, data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [secondDriverData, setSecondDriverData] = useState(() => {
    return data.SecondDriver.FirstName ? data.SecondDriver : null;
  });
  const { mutate: secondDriverInfo, isLoading } = useMutation(
    (SecondDriverDetail) => postDriverSecondInfo(SecondDriverDetail),

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

  const onSubmit = (value) => {
    secondDriverInfo(value);
  };

  return (
    <Formik
      initialValues={initialValuesSecondDriver}
      validationSchema={validationSchemaSecondDriver}
      onSubmit={onSubmit}>
      <AccordionContainer>
        {!secondDriverData && (
          <ListItemButton
            label="افزودن راننده دوم"
            imgSrc="/cargo/second-driver-true.svg"
            onClick={() => setIsOpen(true)}
          />
        )}

        {secondDriverData && secondDriverData !== null && (
          <SecondDriverContainer>
            <Typography title="راننده دوم" type="LabelMedium" />
            <AccordionKit
              title={<Title item={secondDriverData} />}
              content={
                <Content
                  setSecondDriverData={setSecondDriverData}
                  item={secondDriverData}
                  logisticReqAppId={logisticReqAppId}
                />
              }
            />
          </SecondDriverContainer>
        )}
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
                isLoading={isLoading}
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
      </AccordionContainer>
    </Formik>
  );
}
