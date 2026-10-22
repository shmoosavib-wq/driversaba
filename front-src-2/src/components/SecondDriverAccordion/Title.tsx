import RandomColors from "@/components/RandomColors";
import Typography from "@/components/Typography";

import { TitleContainer, DriverDetailContainer } from "./style";

interface PropsType {
  item: {
    FirstName: string;
    LastName: string;
    MobileNumber: string;
  };
}


export default function Title({ item }: PropsType) {
  return (
    <TitleContainer>
      <RandomColors
        fullName={`${item.FirstName} ${item.LastName}`}
        height="50px"
        width="50px"
        fontSize="20px"
      />
      <DriverDetailContainer>
        <Typography
          title={`${item.FirstName} ${item.LastName}`}
          type="LabelSmall"
        />
        <Typography title={item.MobileNumber} type="LabelSmall" />
      </DriverDetailContainer>
    </TitleContainer>
  );
}