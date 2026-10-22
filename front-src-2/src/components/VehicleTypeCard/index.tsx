import { AddTruckTypeValues } from "@/pages/identify/VehicleType/formTools/constants";

import {
  Image,
  Input,
  Label,
  VehicleName,
} from "@/components/VehicleTypeCard/style";

export default function VehicleTypeCard({ selectedOption, setSelectedOption }) {
  const handleInputChange = (id: number) => {
    setSelectedOption(id);
  };

  return (
    <>
      {AddTruckTypeValues.map((i) => (
        <Label key={i.id} isChecked={selectedOption === i.id}>
          <Input
            type="radio"
            id={`input-${i.id}`}
            onChange={() => handleInputChange(i.id)}
            checked={selectedOption === i.id}
          />
          <VehicleName>{i.name}</VehicleName>
          <Image src={`/images/addTruckType/${i.id}.svg`} alt="truck" />
        </Label>
      ))}
    </>
  );
}
