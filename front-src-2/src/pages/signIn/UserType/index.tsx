import { useNavigate } from "react-router-dom";

import SelcetCart from "@/components/SelectCart";

import { UserType as UserTypeVal } from "./constant/index";
import {
  CartContainer,
  Container,
  TextContainer,
  UserSelectText,
  WarningContainer,
  WarningText,
  WarningIcon,
} from "./style";

const UserType = () => {
  const navigate = useNavigate();

  const onClick = (id: number) => {
    navigate("/reg/user-select", {
      state: { IsNatural: id === 1 ? true : false },
      replace: true,
    });
  };
  return (
    <Container>
      <TextContainer>
        <UserSelectText>نوع کاربری خود را انتخاب کنید</UserSelectText>
      </TextContainer>
      <WarningContainer>
        <WarningIcon src="/images/icons/alert.svg" alt="alert" />
        <WarningText>
          توجه کنید که انتخاب شما غیر قابل تغییر خواهد بود
        </WarningText>
      </WarningContainer>
      <CartContainer>
        {UserTypeVal.map((item, idx) => (
          <SelcetCart item={item} onClick={onClick} />
        ))}
      </CartContainer>
    </Container>
  );
};

export default UserType;
