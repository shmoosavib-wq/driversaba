import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import { getFleetsInfo } from "@/services/equipment/equipment-api";
import AccordionKit from "@/components/Accordion";
import ButtonKit from "@/components/Button";
import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";

import Title from "./Title";
import Content from "./Content";
import {
  AccordionContainer,
  StatusContent,
  StatusText,
  AddVehicleButton,
  EmptyDataPlaceholder,
} from "./style";

export default function MyVehicle() {
  const navigate = useNavigate();
  const { data, status } = useQuery(["Fleets"], getFleetsInfo);

  return (
    <>
      {status === "loading" && (
        <StatusContent>
          <Loading />
        </StatusContent>
      )}
      {status === "error" && (
        <StatusContent>
          <StatusText>مشکلی پیش آمده است</StatusText>
        </StatusContent>
      )}
      <AccordionContainer>
        <Typography title="ناوگان ها" type="LabelMedium" />
        {status === "success" &&
          (data.length === 0 ? (
            <>
              <EmptyDataPlaceholder>
                <img src="/images/myVehicle/truck.svg" alt="truck" />
                <p>شما هیچ ناوگانی در صبا بار ندارید</p>
              </EmptyDataPlaceholder>
              <AddVehicleButton>
                <ButtonKit
                  width="155px"
                  height="48px"
                  onClick={() => navigate("/addVehicle")}
                  theme="black"
                  shape="pill">
                  <Typography
                    title="افزودن ناوگان"
                    type="LabelLarge"
                    color="#fff"
                  />
                  <Image
                    src="/myVehicle/plus.svg"
                    alt="plus-icon"
                    style={{ paddingRight: "8px" }}
                  />
                </ButtonKit>
              </AddVehicleButton>
            </>
          ) : (
            data.map((vehicle: any) => (
              <>
                <AccordionKit
                  title={<Title item={vehicle} />}
                  content={<Content item={vehicle} />}
                />
                <AddVehicleButton>
                  <ButtonKit
                    width="100%"
                    height="48px"
                    onClick={() => navigate("/addVehicle")}
                    theme="black"
                    shape="pill">
                    <Typography
                      title="افزودن ناوگان"
                      type="LabelLarge"
                      color="#fff"
                    />
                    <Image
                      src="/myVehicle/plus.svg"
                      alt="plus-icon"
                      style={{ paddingRight: "8px" }}
                    />
                  </ButtonKit>
                </AddVehicleButton>
              </>
            ))
          ))}
      </AccordionContainer>
    </>
  );
}
