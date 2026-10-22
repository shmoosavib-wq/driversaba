import { useState } from "react";
import styled from "styled-components";

import Typography from "@/components/Typography";
import AddSecondDriver from "@/components/AddSecondDriver";
import ButtonKit from "@/components/Button";
import WaybillCargoInfoCard from "@/components/WaybillCargoInfoCard";

export default function WayBillInfo({ nextStep, setNextPage, remittanceInfo }) {
  const [secondDriverInfo, setSecondDriverInfo] = useState();

  return (
    <Container>
      <div>
        <TextContainer>
          <Typography title="اطلاعات بار را تایید کنید" type="LabelLarge" />
        </TextContainer>

        <WaybillCargoInfoCard item={remittanceInfo} key={Math.random()} />
        <AddSecondDriver
          setDriverInfo={setSecondDriverInfo}
          driverInfo={secondDriverInfo}
        />
      </div>
      <ButtonContainer>
        <ButtonKit
          onClick={() => setNextPage(false)}
          text="ویرایش شماره حواله"
          width="100%"
          height="48px"
        />
        <ButtonKit
          onClick={() => nextStep()}
          text="تایید و ادامه"
          theme="blue"
          width="100%"
          height="48px"
        />
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 4px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100dvh - 180px);
  overflow-y: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 0;
`;

const TextContainer = styled.div`
  margin-bottom: 32px;
`;
