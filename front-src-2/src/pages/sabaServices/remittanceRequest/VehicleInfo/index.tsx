import { Form, Formik } from "formik";

import { InputKit, Plate } from "@/components";
import Typography from "@/components/Typography";

import ButtonKit from "@/components/Button";
import { Container, PlateContainer, WrapperVehicleInfo } from "../style";
import { ButtonContainer } from "@/components/Filter";
import { useSabaServiceValue } from "@/store";

export default function VehicleInfo({ nextStep }) {
  const { setSabaServiceValue } = useSabaServiceValue((state) => state);

  return (
    <Formik
      initialValues={{
        SmartNumber: null,
        LicensePlate: null,
      }}
      onSubmit={(val) => {
        setSabaServiceValue(val);
        nextStep();
      }}>
      <Form>
        <Container>
          <Typography type="LabelLarge">اطلاعات ناوگان را وارد کنید</Typography>
          <WrapperVehicleInfo>
            <div>
              <InputKit
                label="شماره هوشمند ناوگان"
                placeholder="مثلا 0012345678"
                name="SmartNumber"
                mask="0000000"
                type="tel"
              />
            </div>
            <PlateContainer>
              <Plate name="LicensePlate" />
            </PlateContainer>
          </WrapperVehicleInfo>
          <ButtonContainer>
            <ButtonKit theme="blue" width="95%" type="submit">
              ثبت و ادامه
            </ButtonKit>
          </ButtonContainer>
        </Container>
      </Form>
    </Formik>
  );
}
