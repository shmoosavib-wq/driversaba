import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useMutation, useQuery } from "react-query";

import { toaster } from "baseui/toast";
import { AxiosError } from "axios";
import { Spinner } from "baseui/spinner";

import BankCard from "@/components/BankCard";
import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";
import { getSabaCart, selectDeopsitWay } from "@/services/payment/payment-api";
import Loading from "@/components/Loading";
import { ButtonContainer, Container, Wrapper } from "../style";
import Toaster from "@/components/global/Toast";

export default function SabaDeposit() {
  const location = useLocation();
  const navigate = useNavigate();
  const logisticRequestAppId = location.state;
  const [selectedSabaNumber, setSelectedSabaNumber] = useState();
  const { data: CartInfo, isLoading } = useQuery(["SABA-DEPO"], () =>
    getSabaCart(logisticRequestAppId)
  );

  const { mutate: postSabaNumber, isLoading: LoadingPost } = useMutation(
    (data: any) => selectDeopsitWay(data),
    {
      onSuccess: () => {
        toaster.positive(<Toaster text={"عملیات با موفقیت انجام شد"} />);
        navigate(-1);
      },
      onError: (res: AxiosError<{ Errors: [] }>) => {
        toaster.negative(<Toaster text={res.response?.data.Errors} />);
      },
    }
  );

  useEffect(() => {
    CartInfo && setSelectedSabaNumber(CartInfo[0].Pan);
  }, [CartInfo]);

  const handleSelectCard = (cardInfo, idx) => {
    setSelectedSabaNumber(cardInfo.Pan);
    setSelectedCardId(idx);
  };
  const handlePostCard = () => {
    postSabaNumber({
      sabaNumber: selectedSabaNumber,
      logisticRequestAppId: logisticRequestAppId,
    });
  };

  const [selectedCardId, setSelectedCardId] = useState(0);

  return (
    <Container>
      {isLoading ? (
        <Loading />
      ) : (
        <Wrapper>
          <Typography type="LabelLarge">
            صبا کارت مقصد را انتخاب کنید
          </Typography>
          {CartInfo?.map((cardInfo, idx) => (
            <BankCard
              key={idx}
              name={cardInfo.FullName}
              number={cardInfo.Pan}
              onClick={() => handleSelectCard(cardInfo, idx)}
              isSelected={selectedCardId === idx}
            />
          ))}

          <ButtonContainer>
            <ButtonKit theme="blue" width="90%" onClick={handlePostCard}>
              {LoadingPost ? (
                <Spinner $size="15px" $borderWidth="2px" />
              ) : (
                " ثبت درخواست"
              )}
            </ButtonKit>
          </ButtonContainer>
        </Wrapper>
      )}
    </Container>
  );
}
