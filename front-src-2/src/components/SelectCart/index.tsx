import { Spinner } from "baseui/spinner";
import {
  Description,
  DescriptionButton,
  DescriptionButtonText,
  DescriptionContainer,
  ImgTag,
  MainContainer,
} from "./style";

interface itemPropsType {
  id: number;
  role?: string;
  buttonName: string;
  imgSrc: string;
  description?: string;
}
interface PropsType {
  item: itemPropsType;
  onClick: (e: number) => void;
  isLoading?: boolean;
  selectedId?: number;
}

const SelcetCart = ({ item, onClick, isLoading, selectedId }: PropsType) => {
  return (
    <MainContainer>
      <ImgTag
        cartDescription={item?.description}
        src={item?.imgSrc}
        alt={item?.imgSrc}
      />
      <DescriptionContainer>
        <Description dir="rtl">{item?.description}</Description>
        <DescriptionButton
          opacity={isLoading && selectedId === item.id}
          disabled={isLoading && selectedId === item.id}
          onClick={() => onClick(item?.id)}>
          <DescriptionButtonText>
            {isLoading && selectedId === item.id ? (
              <Spinner $size="15px" $borderWidth="2px" $color="black" />
            ) : (
              item?.buttonName
            )}
          </DescriptionButtonText>
        </DescriptionButton>
      </DescriptionContainer>
    </MainContainer>
  );
};

export default SelcetCart;
