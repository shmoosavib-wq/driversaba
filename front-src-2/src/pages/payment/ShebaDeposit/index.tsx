import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { toaster } from "baseui/toast";
import { AxiosError } from "axios";
import { Spinner } from "baseui/spinner";

import BankCard from "@/components/BankCard";
import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";
import { getShebaCart, selectDeopsitWay } from "@/services/payment/payment-api";
import Loading from "@/components/Loading";
import { ButtonContainer, Container, Wrapper } from "../style";
import Toaster from "@/components/global/Toast";

export default function ShebaDeposit() {
  const location = useLocation();
  const navigate = useNavigate();
  const LogisticRequestAppId =
    location.state.LogisticRequestAppId ?? location.state;

  const IsSheba = location.pathname.includes("sheba-deposit");
  const { data: CartInfo, isLoading } = useQuery(["SHEBA-DEPO"], () =>
    getShebaCart(LogisticRequestAppId)
  );

  const { mutate: postShebaNumber, isLoading: LoadingPost } = useMutation(
    (data: any) => selectDeopsitWay(data),
    {
      onSuccess: () => {
        toaster.positive(<Toaster text={"شماره شبای شما با موفقیت ثبت شد"} />);
        navigate("/?t=status");
      },
      onError: (res: AxiosError<{ Errors: [] }>) => {
        toaster.negative(<Toaster text={res.response?.data.Errors} />);
      },
    }
  );

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedShebaNumber, setSelectedShebaNumber] = useState(null);
  const Navigate = useNavigate();
  const handleSelectCard = (cardInfo, idx) => {
    setSelectedShebaNumber(cardInfo.ShebaNumber);
    setSelectedCardId(idx);
  };
  const handlePostCard = () => {
    postShebaNumber({
      shebaNumber: selectedShebaNumber,
      logisticRequestAppId: LogisticRequestAppId,
    });
  };

  return (
    <Container>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Wrapper>
            <Typography type="LabelLarge">حساب مقصد را انتخاب کنید</Typography>
            {CartInfo.ShebaNumbers?.map((cardInfo, idx) => (
              <BankCard
                shebaInfo={cardInfo}
                key={idx}
                IsSheba={IsSheba}
                name={cardInfo.FullName}
                number={cardInfo.ShebaNumber}
                onClick={() => handleSelectCard(cardInfo, idx)}
                isSelected={selectedCardId === idx}
              />
            ))}

            <ButtonKit
              shape="pill"
              width="120px"
              onClick={() => {
                Navigate("/add-sheba", {
                  state: {
                    LogisticRequestAppId,
                    secondDriverFullName: CartInfo.SecondDriverFullName,
                  },
                });
              }}>
              افزودن شبا +
            </ButtonKit>
          </Wrapper>

          <ButtonContainer>
            <ButtonKit theme="blue" width="90%" onClick={handlePostCard}>
              {LoadingPost ? (
                <Spinner $size="15px" $borderWidth="2px" />
              ) : (
                " ثبت درخواست"
              )}
            </ButtonKit>
          </ButtonContainer>
        </>
      )}
    </Container>
  );
}
