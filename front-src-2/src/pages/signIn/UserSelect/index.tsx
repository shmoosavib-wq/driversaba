import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import Cookies from "js-cookie";

import { postSelection } from "@/services/login-api";
import SelcetCart from "../../../components/SelectCart";
import { ShowToast } from "@/components";

import { UserPostSelectionNatural } from "./formTools/constants";
import { UserPostSelectionlegal } from "./formTools/constants";
import {
  CartContainer,
  ContentContainer,
  GenuinelegalDiv,
  MainContainer,
  TitleDiv,
  Text,
} from "./style";

// definitions post-data type
interface UserSelectType {
  postName: string;
  isNatural: boolean;
  mobileNumber: string;
  referrerPersonId: string;
  Guid: string;
}

// definitions map type
interface IKeys {
  PHONE: string;
  ROLE: string;
}

// check user localstorage history
const userHistory = (
  userSelected: string,
  mobileNumber: string,
  loginHistoryData: string
) => {
  let findUser = JSON.parse(loginHistoryData)?.find(
    (item: IKeys) => item.PHONE === mobileNumber
  );
  if (findUser) {
    const newRole = JSON.parse(loginHistoryData)?.map((obj: IKeys) => {
      if (obj.PHONE === mobileNumber) {
        return { ...obj, ROLE: userSelected };
      }
      return obj;
    });
    localStorage.setItem("login-history", JSON.stringify(newRole));
  } else if (userSelected) {
    if (loginHistoryData) {
      localStorage.setItem(
        "login-history",
        JSON.stringify([
          ...JSON.parse(loginHistoryData),
          {
            PHONE: mobileNumber,
            ROLE: userSelected,
          },
        ])
      );
    } else {
      localStorage.setItem(
        "login-history",
        JSON.stringify([{ PHONE: mobileNumber, ROLE: userSelected }])
      );
    }
  }
};

export default function UserSelect() {
  const { mutate: submitPost, isLoading } = useMutation(
    (postParams: UserSelectType) => postSelection(postParams)
  );
  const [selectedId, setSelectedId] = useState<number>();

  const navigate = useNavigate();
  const location = useLocation();

  const mobileNumber = localStorage.getItem("Phone");
  const referral = Cookies.get("referral");
  const loginHistoryData = localStorage.getItem("login-history");

  const onClick = (id: number) => {
    setSelectedId(id);

    if (location.pathname.includes("user-select") || location.pathname == "/") {
      switch (id) {
        case 1:
          return handleRoleSubmition("productowner");
        case 2:
          return handleRoleSubmition("driver");
        case 3:
          return handleRoleSubmition("logisticservices");

        default:
          return null;
      }
    }
  };

  const handleRoleSubmition = (userSelected: string) => {
    const params = {
      postName: userSelected,
      isNatural:
        location?.state?.IsNatural ?? localStorage.getItem("isNatural"),
      mobileNumber: mobileNumber,
      referrerPersonId: referral,
      Guid: location?.state?.Guid ?? Cookies.get("Guid"),
    };

    // add user PHONE & ROLE to LocalStorage
    userHistory(userSelected, mobileNumber, loginHistoryData);

    submitPost(params, {
      onSuccess: (data) => {
        Cookies.set("Token", data.Token, {
          expires: 7,
          path: "/",
          secure: true,
        });
        localStorage.setItem("ISAUTH", data.IsAuthorized);
        localStorage.setItem("ROLE", userSelected);
        localStorage.setItem(
          "isNatural",
          location?.state?.IsNatural ?? localStorage.getItem("isNatural")
        );
        Cookies.remove("Guid");

        if (userSelected === "driver") {
          navigate("/", { replace: true });
        } else if (userSelected === "productowner") {
          navigate("/owner/cargos/ongoing", { replace: true });
        } else {
          navigate("/logistic/cargo-terminal/bids", { replace: true });
        }
        <ShowToast
          toastMode={"positive"}
          toastText={"نقش شما با موفقیت ثبت شد"}
        />;
      },
      onError: (err: any) => {
        <ShowToast
          toastMode={"negative"}
          toastText={err.response.data.Message}
        />;
      },
    });
  };

  return (
    <MainContainer>
      <ContentContainer>
        {location?.state?.IsNatural === true ||
        localStorage.getItem("isNatural") === "true" ? (
          <GenuinelegalDiv>
            <TitleDiv>
              <Text>نقش خود را برای ورود به پنل انتخاب کنید</Text>
            </TitleDiv>
            <CartContainer>
              {UserPostSelectionNatural.map((item, idx) => (
                <SelcetCart
                  key={idx}
                  item={item}
                  onClick={onClick}
                  isLoading={isLoading}
                  selectedId={selectedId}
                />
              ))}
            </CartContainer>
          </GenuinelegalDiv>
        ) : (
          <GenuinelegalDiv>
            <TitleDiv>
              <Text>نقش خود را برای ورود به پنل انتخاب کنید</Text>
            </TitleDiv>
            <CartContainer>
              {UserPostSelectionlegal.map((item, idx) => (
                <SelcetCart
                  key={idx}
                  item={item}
                  onClick={onClick}
                  isLoading={isLoading}
                  selectedId={selectedId}
                />
              ))}
            </CartContainer>
          </GenuinelegalDiv>
        )}
      </ContentContainer>
    </MainContainer>
  );
}
