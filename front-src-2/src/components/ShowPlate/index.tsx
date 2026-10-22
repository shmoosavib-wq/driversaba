import {
  MainContainer,
  PlateFlex,
  PlateImg,
  PlateIran,
  PlateIranText,
  PlateNumber,
  PlateChar,
} from "./style";

interface PropType {
  SerialNumber: string;
  width?: string;
}

const ShowPlate = ({ SerialNumber, width = null }: PropType) => {
  const resultArray = SerialNumber?.split(".");

  return (
    <MainContainer>
      <PlateNumber>
        <PlateIran>
          <PlateIranText>ایران</PlateIranText>
          <PlateIranText>{resultArray && resultArray[3]}</PlateIranText>
        </PlateIran>
        <PlateFlex>{resultArray && resultArray[2]}</PlateFlex>
        <PlateChar>{resultArray && resultArray[1]}</PlateChar>
        <PlateFlex>{resultArray && resultArray[0]}</PlateFlex>
      </PlateNumber>
      <PlateImg width={width} src="/images/plate/plate.svg" alt="plate-img" />
    </MainContainer>
  );
};

export default ShowPlate;
