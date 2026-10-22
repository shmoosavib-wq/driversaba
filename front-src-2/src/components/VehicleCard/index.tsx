import { useEffect } from "react";
import { useQuery } from "react-query";
import { useFormikContext } from "formik";
import { useLocation } from "react-router-dom";

import { getDriverEquipments } from "@/services/driver/driver-api";
import ShowPlate from "../ShowPlate";
import Typography from "../Typography";
import Loading from "../Loading";

import {
  Image,
  Input,
  Label,
  CargoDetail,
  CargoContainer,
  StatusContent,
  StatusText,
} from "./style";

export default function VehicleCard({
  selectedOption,
  setSelectedOption,
  setSecondDriverInfo,
  secondDriverInfo,
}) {
  const { setValues, values } = useFormikContext();
  const location = useLocation();

  const { data: cargos, status } = useQuery(["Second-Driver"], () =>
    getDriverEquipments(location?.state)
  );

  const handleInputChange = (id: number) => {
    setSelectedOption(id);
  };

  useEffect(() => {
    setValues({
      // @ts-ignore
      ...values,
      SecondDriverId: secondDriverInfo?.Id ?? null,
    });
  }, [setValues, setSecondDriverInfo, secondDriverInfo]);

  return (
    <>
      {status === "loading" && <Loading />}
      {status === "error" && (
        <StatusContent>
          <StatusText>مشکلی پیش آمده است</StatusText>
        </StatusContent>
      )}
      {status === "success" && (
        <>
          {cargos?.map((i, idx) => (
            <Label
              key={idx}
              isChecked={selectedOption === i.TransportEquipmentId}>
              <Input
                type="radio"
                id={`input-${i.TransportEquipmentId}`}
                onChange={() => {
                  setValues({
                    TransportEquipmentId: i.TransportEquipmentId,
                    LogisticRequestAppId: location?.state,
                    SecondDriverId: secondDriverInfo?.Id ?? null,
                  });
                  handleInputChange(i.TransportEquipmentId);
                }}
                checked={selectedOption === i.TransportEquipmentId}
              />
              <CargoDetail>
                <CargoContainer>
                  <Typography title={i.VehicleType} type="LabelMedium" />
                  <Typography title={i.LoaderType} type="LabelMedium" />
                </CargoContainer>
                <div dir="rtl">
                  <ShowPlate SerialNumber={i.SerialNumber} />
                </div>
              </CargoDetail>
              <Image
                src={`/images/cargo/truck/${i.LoaderTypeId}.svg`}
                alt="truck"
              />
            </Label>
          ))}
        </>
      )}
    </>
  );
}
