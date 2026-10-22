import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { PinCode } from "baseui/pin-code";
import { Toast, KIND, toaster } from "baseui/toast";
import { useMutation } from "react-query";

import ResendCode from "@/components/ResendCode";
import { postSelection, verifyApi } from "@/services/login-api";
import ButtonKit from "@/components/Button";
import Toaster from "@/components/global/Toast";

import {
  ButtonContainer,
  EditContainer,
  EditNumber,
  EditSection,
  EditText,
  PinCodeContainer,
  Container,
  VerificationContaier,
  VerificationImage,
  VerificationSection,
} from "./style";

interface postCodeType {
  mobileNumber: string;
  inputValue: string;
}

interface postSelectionType {
  mobileNumber: string;
  isNatural: boolean;
  Guid: string;
  referrerPersonId: string;
  postName: string;
}
const Verification = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { mutate: postCode, isLoading } = useMutation(
    (verificationData: postCodeType) => verifyApi(verificationData)
  );

  const [second, setSecond] = useState(59);
  const [inputValue, setInputValue] = useState([" ", " ", " ", " "]);
  const verificationRef = useRef(null);
  const navigate = useNavigate();
  const mobileNumber = localStorage.getItem("Phone");

  const loginHistory = localStorage.getItem("login-history");
  let allMobileNumber = JSON.parse(loginHistory)?.map((item) => item.PHONE);

  // let userPostSelection = JSON.parse(loginHistory)?.find(
  //   (item) => item.PHONE === mobileNumber
  // )?.ROLE;
  let userPostSelection = "driver";
  useEffect(() => {
    countDown();

    if (second === 0) {
      clearTimeout(second);
    }
  }, [second]);

  const countDown = (): any => {
    if (second > 0) {
      setTimeout(() => {
        setSecond(second - 1);
      }, 1000);
    }
  };

  const { mutate: submitPost, isLoading: loading } = useMutation(
    (postParams: postSelectionType) => postSelection(postParams)
  );

  const handleLogin = () => {
    // Assuming you want to limit the length of the pin code
    const newPinCodeArray = inputValue.join("");
    const formData = new FormData();
    formData.append("MobileNumber", mobileNumber);
    formData.append("FourDigitCode", newPinCodeArray);
    if (!inputValue || inputValue.length < 4) {
      // Toast.error("فیلد های خالی را پر کنید");
      <Toast kind={KIND.negative}>فیلد های خالی را پر کنید</Toast>;
    } else {
      postCode(
        //@ts-ignore
        formData,
        {
          onSuccess: (data: any) => {
            Cookies.set("Guid", data?.Guid);
            // if (data.IsNatural === null) {
            //   navigate("/reg/user-type", { replace: true });
            // } else if (allMobileNumber?.includes(mobileNumber)) {
            const params = {
              // postName: userPostSelection,
              postName: "driver",
              // isNatural: data.IsNatural ?? localStorage.getItem("isNatural"),
              isNatural: true,
              mobileNumber: mobileNumber ?? JSON.parse(loginHistory)?.PHONE,
              referrerPersonId: Cookies.get("referral"),
              Guid: data?.Guid,
            };
            submitPost(params, {
              onSuccess: (newdata: any) => {
                Cookies.set("Token", newdata.Token, {
                  expires: 7,
                  path: "/",
                  secure: true,
                });
                localStorage.setItem("ISAUTH", newdata.IsAuthorized);
                localStorage.setItem("ROLE", userPostSelection);
                localStorage.setItem(
                  "isNatural",
                  data.IsNatural ?? localStorage.getItem("isNatural")
                );
                Cookies.remove("Guid");

                let returnUrl = searchParams.get("returnUrl");
                const matchRef = returnUrl?.includes("ref");
                // let url = matchRef || "/verification" ? "/" : returnUrl;
                let url = matchRef || !location.search ? "/" : returnUrl;

                navigate(url, { replace: true });

                // if (userPostSelection === "driver") {
                //   navigate("/", {
                //     replace: true,
                //   });
                // } else if (userPostSelection === "productowner") {
                //   navigate("/owner/cargos/ongoing", { replace: true });
                // } else {
                //   navigate("/logistic/cargo-terminal/bids", {
                //     replace: true,
                //   });
                // }
              },
            });
            // } else {
            //   navigate("/reg/user-select", {
            //     replace: true,
            //     state: data,
            //   });
            // }
          },
          onError: (err: any) => {
            toaster.negative(
              <Toaster type="negative" text={err.response.data.Errors} />
            );
          },
        }
      );
    }
  };

  useEffect(() => {
    // click the confirmation button automatically
    const isFilled = inputValue.every((item) => item.trim() !== "");
    if (isFilled) return handleLogin();
  }, [inputValue]);

  return (
    <Container>
      {" "}
      <VerificationSection ref={verificationRef}>
        <VerificationImage
          src={"/images/authentication/verification/verification.svg"}
          alt="verification"
        />
        <VerificationContaier>
          <EditSection>
            <EditContainer>
              <EditText>
                {`کد چهار رقمی ورود شما به شماره ${mobileNumber} ارسال شد`}
              </EditText>
              <EditNumber onClick={() => navigate("/login", { replace: true })}>
                ویرایش شماره همراه
              </EditNumber>
            </EditContainer>
            <PinCodeContainer>
              <PinCode
                values={inputValue}
                onChange={({ values }) => setInputValue(values)}
                overrides={{
                  Root: {
                    style: {
                      direction: "ltr",
                    },
                  },
                  Input: {
                    props: {
                      overrides: {
                        Root: {
                          style: () => ({
                            borderRadius: "8px",
                          }),
                        },
                      },
                    },
                  },
                }}
              />
            </PinCodeContainer>
          </EditSection>

          <ButtonContainer>
            <ResendCode
              second={second}
              setSecond={setSecond}
              countDown={countDown}
            />
            <ButtonKit
              onClick={handleLogin}
              text={"تایید"}
              theme={"blue"}
              disabled={second === 0}
              isLoading={isLoading}
              width="100%"
              height="50px"
            />
          </ButtonContainer>
        </VerificationContaier>
      </VerificationSection>
    </Container>
  );
};

export default Verification;
