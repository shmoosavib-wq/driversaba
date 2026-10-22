import { useState } from "react";

import Navbar from "@/layout/Navbar";

import DriverInfo from "./DriverInfo";
import VehicleInfo from "./VehicleInfo";
import AddressInfo from "./AddressInfo";
import CargoInfo from "./CargoInfo";

const steps = [
  {
    title: "راننده",
    id: 1,
  },
  {
    title: "ناوگان",
    id: 2,
  },
  {
    title: "آدرس",
    id: 3,
  },
  {
    title: "محموله",
    id: 4,
  },
];
export default function RemittanceRequest() {
  const [currentStep, seCurrentStep] = useState(0);
  const onNext = () => {
    seCurrentStep((prev) => prev + 1);
  };
  return (
    <Navbar title="صبا خدمت" steps={steps} current={currentStep}>
      {currentStep === 0 && <DriverInfo nextStep={onNext} />}
      {currentStep === 1 && <VehicleInfo nextStep={onNext} />}
      {currentStep === 2 && <AddressInfo nextStep={onNext} />}
      {currentStep === 3 && <CargoInfo lastProps={true} />}
    </Navbar>
  );
}
