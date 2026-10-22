import { useMutation } from "react-query";

import ButtonKit from "../Button";
import { login } from "@/services/login-api";

const ResendCode = ({ second, setSecond, countDown }) => {
  let PhoneNumber = localStorage.getItem("Phone");

  const { mutate: postMobile } = useMutation((loginData: any) =>
    login(loginData)
  );

  return (
    <ButtonKit
      theme={"blue"}
      width="100%"
      height="50px"
      text={
        <div>
          {second !== 0 && `  ${second < 10 ? second : second} :00 `}
          ارسال مجدد کد
        </div>
      }
      onClick={() => {
        if (second === 0) {
          console.log("click");
          postMobile(
            { MobileNumber: PhoneNumber },
            {
              onSuccess: () => {
                if (second !== 59) {
                  setSecond(59);
                } else {
                  countDown();
                }
              },
            }
          );
        }
      }}
      isLoading={false}
      disabled={second !== 0}></ButtonKit>
  );
};

export default ResendCode;
