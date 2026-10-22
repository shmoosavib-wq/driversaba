import { useState } from "react";

import Navbar from "@/layout/Navbar";
import { useSabaServiceValue } from "@/store";

import DriverInfo from "../remittanceRequest/DriverInfo";
import VehicleInfo from "../remittanceRequest/VehicleInfo";
import AddressInfo from "../remittanceRequest/AddressInfo";
import CargoInfo from "../remittanceRequest/CargoInfo";

import ConfirmationRemittance from "./ConfirmationRemittance";
import Remittence from "./Remittence";
import LoadWeight from "./LoadWeight";

const WaybillStepsTitle = [
  {
    title: "حواله",
    id: 1,
  },
  {
    title: "وزن بارگیری",
    id: 2,
  },
];
const remittanceStepsTitle = [
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
  {
    title: "وزن بارگیری",
    id: 5,
  },
];

export default function WaybillRequest() {
  const data = useSabaServiceValue((state) => state.data);

  const [wayBillState, setWayBillState] = useState(-1);
  const [step, setStep] = useState(0);

  const onNext = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <>
      {wayBillState === -1 && (
        <Navbar title="درخواست بارنامه">
          <ConfirmationRemittance setWayBillState={setWayBillState} />
        </Navbar>
      )}
      {wayBillState === 0 && (
        <Navbar
          title="درخواست بارنامه"
          current={step}
          steps={WaybillStepsTitle}>
          {step === 0 && <Remittence nextStep={onNext} />}
          {step === 1 && (
            <LoadWeight nextStep={onNext} hasRemittanceSent={true} />
          )}
        </Navbar>
      )}
      {wayBillState === 1 && (
        <Navbar
          title="درخواست بارنامه"
          current={step}
          steps={remittanceStepsTitle}>
          {step === 0 && <DriverInfo nextStep={onNext} />}
          {step === 1 && <VehicleInfo nextStep={onNext} />}
          {step === 2 && <AddressInfo nextStep={onNext} />}
          {step === 3 && <CargoInfo nextStep={onNext} />}
          {step === 4 && (
            <LoadWeight nextStep={onNext} hasRemittanceSent={false} />
          )}
        </Navbar>
      )}
    </>
  );
}
