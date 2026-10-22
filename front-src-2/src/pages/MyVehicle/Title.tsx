import ShowPlate from "@/components/ShowPlate";

import {
  TitleContainer,
  Section,
  TextLabelContainer,
  TextLabel,
  PlateContainer,
  AccordionImg,
} from "./style";

interface PropsType {
  item: {
    SerialNumber: string;
    VehicleType: { value: number; label: string }; // Define the VehicleType type
    LoaderType: { value: number; label: string }; // Define the LoaderType type
  };
}

export default function Title({ item }: PropsType) {
  return (
    <TitleContainer>
      <AccordionImg
        src={`/images/fleets/${item.VehicleType?.value}.svg`}
        alt="img"
      />
      <Section>
        <TextLabelContainer>
          <TextLabel>{item.VehicleType.label}</TextLabel>
          <TextLabel>{item.LoaderType.label}</TextLabel>
        </TextLabelContainer>
        <PlateContainer>
          <ShowPlate SerialNumber={item.SerialNumber} />
        </PlateContainer>
      </Section>
    </TitleContainer>
  );
}
