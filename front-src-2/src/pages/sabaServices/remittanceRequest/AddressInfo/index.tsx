import { Form, Formik } from "formik";

import { DropDown } from "@/components";
import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";
import {
  Container,
  Description,
  DescriptionIcon,
  WrapperAddressInfo,
} from "../style";
import { ButtonContainer } from "@/components/Filter";
import { useSabaServiceValue } from "@/store";

export default function AddressInfo({ nextStep }) {
  const { setSabaServiceValue } = useSabaServiceValue((state) => state);

  return (
    <Formik
      initialValues={{
        SenderId: 0,
        SenderLocationId: "",
        ReceiverId: 0,
        ReceiverLocationId: "",
      }}
      onSubmit={(val) => {
        setSabaServiceValue(val);
        nextStep();
      }}>
      {({ values }) => (
        <Form>
          <Container>
            <Typography type="LabelLarge">
              اطلاعات مبدا و مقصد بارگیری را وارد کنید
            </Typography>
            <WrapperAddressInfo>
              <div>
                <DropDown
                  label="نام فرستنده"
                  name="SenderId"
                  placeHolder="انتخاب کنید"
                  title="نام فرستنده"
                  shortURL="ProductOwners"
                  searchAble
                />
              </div>
              <div>
                <DropDown
                  label="آدرس فرستنده"
                  name="SenderLocationId"
                  placeHolder="انتخاب کنید"
                  title="آدرس فرستنده"
                  shortURL={`Addresses?peopleId=${values.SenderId}`}
                  searchAble
                />
              </div>
              <div>
                <DropDown
                  label="نام گیرنده"
                  name="ReceiverId"
                  placeHolder="انتخاب کنید"
                  title="نام گیرنده"
                  shortURL="ProductOwners"
                  searchAble
                />
              </div>
              <div>
                <DropDown
                  label="آدرس گیرنده"
                  name="ReceiverLocationId"
                  placeHolder="انتخاب کنید"
                  title="آدرس گیرنده"
                  shortURL={`Addresses?peopleId=${values.ReceiverId}`}
                  searchAble
                />
              </div>
              <Description>
                <DescriptionIcon />
                <Typography type="ParagraphMedium">
                  در صورتی که فرستنده یا گیرنده مورد نظرتان را از لیست پیدا
                  نکردید ، گزینه سایر را انتخاب کنید
                </Typography>
              </Description>
            </WrapperAddressInfo>
            <ButtonContainer>
              <ButtonKit theme="blue" width="90%" type="submit">
                ثبت و ادامه
              </ButtonKit>
            </ButtonContainer>
          </Container>
        </Form>
      )}
    </Formik>
  );
}
