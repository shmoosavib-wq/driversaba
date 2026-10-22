import { useState } from "react";
import { useLocation } from "react-router-dom";

import ButtonKit from "@/components/Button";
import VehicleTypeCard from "@/components/VehicleTypeCard/index";
import {
  ButtonContainer,
  CardContainer,
  Container,
  Text,
  VehicleTypeSection,
} from "@/pages/identify/VehicleType/style";

const VehicleType = ({ onSubmit }) => {
  const { pathname } = useLocation();
  const handleSubmit = () => {
    console.log(selectedOption);

    onSubmit(selectedOption);
  };
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <Container>
      <VehicleTypeSection routeStyle={pathname.includes("Identity")}>
        <Text>نوع ناوگان خود را انتخاب کنید</Text>
        <CardContainer>
          <VehicleTypeCard
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />

          <ButtonContainer>
            <ButtonKit
              width="90%"
              height="56px"
              theme={"black"}
              shape={window.innerWidth >= 1024 ? "pill" : "default"}
              text={"تایید نوع ناوگان"}
              onClick={handleSubmit}
              disabled={selectedOption === null}
            />
          </ButtonContainer>
        </CardContainer>
      </VehicleTypeSection>
    </Container>
  );
};

export default VehicleType;
