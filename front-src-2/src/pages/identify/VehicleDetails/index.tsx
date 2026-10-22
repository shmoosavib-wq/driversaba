import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useMutation } from "react-query";
import { toaster } from "baseui/toast";

import { InputKit, Plate } from "@/components";
import ButtonKit from "@/components/Button";
import DropDwon from "@/components/DropDown";
import { addVehicle } from "@/services/identify/identify-api";
import Toaster from "@/components/global/Toast";

import { AddVehicleForm } from "./formTools/formik";

import {
  ButtonContainer,
  Container,
  FlexButton,
  FlexCol,
  PlateContainer,
  VehicleContainer,
  VehicleForm,
} from "./style";

export default function VehicleDetail({ truckId = null }) {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();

  const [formattedPlate, setFormattedPlate] = useState<any>();
  const { mutate, isLoading } = useMutation((data: any) => addVehicle(data), {
    onSuccess: () => {
      toaster.warning(<Toaster text="ناوگان شما با موفقیت افزوده شد" />);
      navigate(-1);
    },
    onError: (res: any) => {
      toaster.negative(<Toaster text={res?.response.data.Errors} />);
    },
  });
  let data = state;
  const palte = data?.SerialNumber?.split(".");
  useEffect(() => {
    if (palte) {
      setFormattedPlate(
        `${palte[0]}\u202A ${palte[1]} \u202C${palte[2]} ${palte[3]}`
      );
    }
  }, [palte]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        LoaderTypeId: data?.LoaderType || "",
        SerialNumber: formattedPlate || "",
        BrandId: data?.Brand || "",
        FuelTypeId: data?.FuelType || "",
        EquipmentConstructionYear: data?.YearOfConstruction || "",
        EquipmentSmartNumber: data?.EquipmentSmartNumber || "",
        TransportEquipmentId: data?.TransportEquipmentId || null,
      }}
      validationSchema={AddVehicleForm.validationSchema}
      onSubmit={(values) => {
        mutate(values);
      }}>
      <Form>
        <Container routeStyle={pathname.includes("Identity")}>
          <VehicleForm>
            <VehicleContainer>
              <FlexCol>
                <InputKit
                  placeholder="مثلا 1234567"
                  label="شماره هوشمند ناوگان"
                  name="EquipmentSmartNumber"
                  type="tel"
                  maxLength={7}
                  mask="0000000"
                />
                <DropDwon
                  searchAble
                  label="نوع بارگیر"
                  placeHolder="مثل کمپرسی"
                  shortURL={`LoaderTypes?equipmentTypeId=${truckId || data?.VehicleType.value}`}
                  title="نوع بارگیر"
                  name="LoaderTypeId"
                />
              </FlexCol>
              <FlexCol>
                <DropDwon
                  searchAble
                  label="نام برند ناوگان"
                  placeHolder="مثل ولوو(volvo)"
                  shortURL="TruckBrand"
                  title="نام برند ناوگان"
                  name="BrandId"
                />

                <PlateContainer>
                  <Plate name="SerialNumber" plateItem={data?.SerialNumber} />
                </PlateContainer>
              </FlexCol>
              <FlexCol>
                <InputKit
                  maxLength={4}
                  placeholder="مثلا 1234"
                  label="سال ساخت"
                  name="EquipmentConstructionYear"
                  type="tel"
                  mask="0000"
                />

                <DropDwon
                  searchAble
                  label="سوخت"
                  placeHolder="مثلا گازویل"
                  shortURL={`VehicleFuelTypes?equipmentTypeId=${truckId || data?.VehicleType.value}`}
                  title="سوخت"
                  name="FuelTypeId"
                />
              </FlexCol>
              <FlexButton>
                <ButtonContainer>
                  <ButtonKit
                    width="90%"
                    height="56px"
                    theme={"blue"}
                    type="submit"
                    shape={window.innerWidth >= 1024 ? "pill" : "default"}
                    text={
                      pathname.includes("editVehicle")
                        ? "ویرایش ناوگان"
                        : "تایید اطلاعات ناوگان"
                    }
                    isLoading={isLoading}
                  />
                </ButtonContainer>
              </FlexButton>
            </VehicleContainer>
          </VehicleForm>
        </Container>
      </Form>
    </Formik>
  );
}
