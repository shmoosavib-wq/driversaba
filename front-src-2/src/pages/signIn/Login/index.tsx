import { useMutation } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";

import { InputKit } from "@/components";
import ButtonKit from "@/components/Button";
import { login } from "@/services/login-api";
import Image from "@/components/global/Image";
import Typography from "@/components/Typography";
import theme from "@/theme";

import { initialValues, validationSchema } from "./formTools/formik";
import {
  Container,
  Body,
  LeftContent,
  LogoContainer,
  RightContent,
  RightLogo,
  InputContent,
  BottomContent,
  RulesParaghraph,
  ButtonContainer,
} from "./style";

interface loginDataType {
  MobileNumber: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { mutate: postMobile, isLoading } = useMutation(
    (loginData: loginDataType) => login(loginData)
  );

  const onSubmit = (values: loginDataType) => {
    postMobile(
      { MobileNumber: values.MobileNumber },
      {
        onSuccess: () => {
          localStorage.setItem("Phone", values.MobileNumber);

          const returnUrl = searchParams.get("returnUrl");
          let url = "/verification";
          if (returnUrl) url += `?returnUrl=${returnUrl}`;

          navigate(url, { replace: true });
        },
        onError: () => {},
      }
    );
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      <Form>
        <Container>
          <Body>
            <LeftContent>
              <LogoContainer>
                <Typography type="LabelLarge">صبابار</Typography>
                <Image src="/icons/logo/saba.svg" alt="saba-logo" />
              </LogoContainer>

              <Image
                src="/authentication/login/logisticWorker.svg"
                alt="workers"
              />
            </LeftContent>

            <RightContent>
              <RightLogo>
                <Image src="/icons/logo/saba.svg" alt="saba-logo" />
                <Typography type="HeadingLarge" title="صبابار" />
              </RightLogo>

              <InputContent>
                <InputKit
                  name="MobileNumber"
                  label="شماره همراه خود را وارد کنید"
                  isLoading={isLoading}
                  placeholder="مثلا : 09123456789"
                  maxLength={11}
                  type="tel"
                  mask="00000000000"
                />
              </InputContent>

              <BottomContent>
                <RulesParaghraph>
                  ورود به برنامه به معنای موافقت با
                  <Link to="/rules">
                    <Typography type="ParagraphSmall" color={theme.colors.Blue}>
                      قوانین و مقررات
                    </Typography>
                  </Link>
                  صبابار است
                </RulesParaghraph>
                <ButtonContainer>
                  <ButtonKit
                    text="تایید شماره همراه"
                    type="submit"
                    theme="blue"
                    width="100%"
                    height="50px"
                    isLoading={isLoading}
                  />
                </ButtonContainer>
              </BottomContent>
            </RightContent>
          </Body>
        </Container>
      </Form>
    </Formik>
  );
}
