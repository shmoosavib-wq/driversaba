import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { useMutation } from "react-query";
import { toaster } from "baseui/toast";

import Navbar from "@/layout/Navbar";
import VehicleCard from "@/components/VehicleCard";
import ButtonKit from "@/components/Button";
import { postAcceptLoad } from "@/services/driver/driver-api";
import Toaster from "@/components/global/Toast";
import AddSecondDriver from "@/components/AddSecondDriver";

import { initialValue, validationSchema } from "./formTools/formik";

import {
  MainContainer,
  Header,
  HeaderRightContent,
  HeaderLeftContent,
  LeftContentParagraph,
  LeftContentImg,
  CargoCardContainer,
  ButtonContainer,
  Content,
  Wrapper,
} from "./style";

export default function AcceptCargo() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [secondDriverInfo, setSecondDriverInfo] = useState(null);

  const { mutate: accLoad, isLoading: accLoadLoading } = useMutation(
    (accLoadData: any) => postAcceptLoad(accLoadData),
    {
      onSuccess: () => {
        navigate("/?t=status");
        toaster.warning(<Toaster text={"بار با موفقیت دریافت شد"} />);
      },
      onError: (res: any) => {
        toaster.negative(
          <Toaster type="negative" text={res.response.data.Errors} />
        );
      },
    }
  );

  const onSubmit = (value) => {
    if (value.TransportEquipmentId === null || undefined) {
      toaster.negative(
        <Toaster type="negative" text="ناوگان خود را انتخاب کنید" />
      );
    } else {
      accLoad(value);
    }
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValue}
      validationSchema={validationSchema}>
      <Form>
        <MainContainer>
          <Wrapper>
            <Navbar title={"قبول بار"}>
              <div style={{ padding: "0 16px" }}>
                <Content>
                  <Header>
                    <HeaderRightContent>
                      ناوگان خود را انتخاب کنید
                    </HeaderRightContent>
                    <HeaderLeftContent onClick={() => navigate("/addVehicle")}>
                      <LeftContentParagraph>افزودن ناوگان</LeftContentParagraph>
                      <LeftContentImg
                        src="/images/cargo/add.svg"
                        alt="img"
                        loading="lazy"
                      />
                    </HeaderLeftContent>
                  </Header>

                  <CargoCardContainer>
                    <VehicleCard
                      secondDriverInfo={secondDriverInfo}
                      setSecondDriverInfo={setSecondDriverInfo}
                      selectedOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                    />
                  </CargoCardContainer>
                </Content>

                <AddSecondDriver
                  setDriverInfo={setSecondDriverInfo}
                  driverInfo={secondDriverInfo}
                />
              </div>
            </Navbar>
          </Wrapper>

          <ButtonContainer>
            <ButtonKit
              width="90%"
              height="50px"
              type="submit"
              theme="blue"
              text={"درخواست حواله"}
              isLoading={accLoadLoading}
            />
          </ButtonContainer>
        </MainContainer>
      </Form>
    </Formik>
  );
}
