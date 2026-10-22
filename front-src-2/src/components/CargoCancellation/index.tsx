import { useState } from "react";
import { Checkbox } from "baseui/checkbox";
import { Form, Formik } from "formik";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import {
  CancellationReason,
  getCargoCancelReason,
} from "@/services/driver/driver-api";

import TextArea from "../TextArea";
import BottomSheet from "../global/BottomSheet";
import ButtonKit from "../Button";
import ListItemButton from "../ListItemButton";
import Loading from "../Loading";

import {
  ButtonContainer,
  CheckBoxContainer,
  Container,
  TextAreaContainer,
} from "./style";

export default function CargoCancellation({ logisticRequestAppId }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery("USERINFO", getCargoCancelReason, {
    enabled: isOpen === true,
  });

  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const { mutate: CancellationDriverId } = useMutation(
    (data: any) => CancellationReason(data),
    {
      onSuccess: () => {
        setIsOpen(false);
        navigate("/");
      },
    }
  );

  return (
    <Container>
      <Formik
        initialValues={{
          cancellationReason: null,
          logisticRequestId: logisticRequestAppId,
          description: "",
        }}
        onSubmit={(values) => {
          console.log("Form Values:", values);
          // Here you can call the mutation or any other logic
          CancellationDriverId(values);
        }}>
        {({ setFieldValue }) => (
          <Form id="main-form">
            <ListItemButton
              imgSrc="/cargo/cargo-cancellation.svg"
              label="انصراف حمل"
              onClick={() => {
                setIsOpen(true);
                // Manually set touched state to true
              }}
            />
            <BottomSheet
              title="علت لغو حمل را انتخاب کنید"
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}>
              {isLoading && <Loading />}

              {data?.map(({ value, label }) => (
                <CheckBoxContainer key={value}>
                  <Checkbox
                    checked={value === selected}
                    onChange={() => {
                      setFieldValue("cancellationReason", value);
                      setSelected(value);
                    }}
                    overrides={{
                      Root: {
                        style: () => ({
                          gap: "10px",
                        }),
                      },
                      Label: {
                        style: () => ({
                          fontSize: "16px",
                          fontWeight: "400",
                        }),
                      },
                    }}>
                    {label}
                  </Checkbox>
                  {value === -1 && selected === -1 && (
                    <TextAreaContainer>
                      <TextArea
                        title="علت لغو حمل را توضیح دهید"
                        name="description"
                      />
                    </TextAreaContainer>
                  )}
                </CheckBoxContainer>
              ))}

              <ButtonContainer>
                <ButtonKit
                  text="انصراف"
                  type="button"
                  height="50px"
                  width="100%"
                  onClick={() => {
                    setIsOpen(false);
                    setSelected(0);
                  }}
                />
                <ButtonKit
                  baseOvrride={{
                    props: {
                      form: "main-form",
                    },
                  }}
                  disabled={selected === 0}
                  text="لغو حمل"
                  type="submit"
                  theme="secondaryRed"
                  height="50px"
                  width="100%"
                />
              </ButtonContainer>
            </BottomSheet>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
