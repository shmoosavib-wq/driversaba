import { useMutation } from "react-query";

import { Spinner } from "react-activity";

import { Formik, Form } from "formik";

import { TextArea, InputKit, DropDown } from "@/components";

import CropperImage from "@/components/CropperImage";

import { postCompanyInformation } from "@/services/identify/identify-api";

import { CompanyInfoItems } from "./formTools/constants";

import { initialValues, validationSchema } from "./formTools/formik";

import { services } from "./formTools/constants";

import {
  MainContainer,
  Content,
  ResponsiveContainer,
  DropDownContainer,
  InputsContainer,
  TextAreaContainer,
  CropperContainer,
  RightContent,
  LeftContent,
  LeftLayout,
  SubmitButtonContainer,
  SubmitButton,
} from "./style";

export default function CompanyInformation() {
  const isNatural = localStorage.getItem("isNatural");
  const ROLE = localStorage.getItem("ROLE");

  const { mutate, isLoading } = useMutation(
    (postData) => postCompanyInformation(postData),
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error: any) => {
        console.log(error.response.data);
      },
    }
  );

  const onSubmit = (data: any) => {
    const formdata: any = new FormData();

    for (const key in data) {
      if (key !== "ROLE") {
        if (ROLE === "logisticservices") {
          formdata.append(key, data[key]);
        } else if (
          key !== "CompanyLocationStatus" &&
          key !== "CargoPermitPhoto"
        ) {
          formdata.append(key, data[key]);
        }
      }
    }

    mutate(formdata);
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      <Form>
        <MainContainer>
          <Content>
            <ResponsiveContainer>
              <RightContent>
                {CompanyInfoItems.map((item, index) =>
                  item.type === "select" ? (
                    <DropDownContainer key={index}>
                      <DropDown
                        title="شهر نمایندگی"
                        shortURL="CitiesAndTheirProvinces"
                        placeHolder="مثلا کرج"
                        label="شهر نمایندگی"
                        name="CompanyCityId"
                      />
                    </DropDownContainer>
                  ) : (
                    <InputsContainer key={index}>
                      <InputKit
                        {...item}
                        name={item.name}
                      />
                    </InputsContainer>
                  )
                )}

                {isNatural === "false" && ROLE === "logisticservices" && (
                  <DropDownContainer>
                    <DropDown
                      title="نوع شرکت"
                      options={services}
                      placeHolder="مثلا سراسری"
                      label="نوع شرکت"
                      name="CompanyLocationStatus"
                    />
                  </DropDownContainer>
                )}
              </RightContent>

              <LeftContent>
                <LeftLayout>
                  <TextAreaContainer>
                    <TextArea name="CompanyAddress" title="آدرس شرکت" />
                  </TextAreaContainer>

                  {isNatural === "false" && ROLE === "logisticservices" && (
                    <CropperContainer>
                      <CropperImage
                        title="مجوز باربری شرکت"
                        cropText="مجوز باربری شرکت را آپلود کنید"
                        name="CargoPermitPhoto"
                      />
                    </CropperContainer>
                  )}

                  <CropperContainer>
                    <CropperImage
                      title="لوگو شرکت"
                      cropText="لوگو شرکت را آپلود کنید"
                      name="CompanyLogoPhoto"
                    />
                  </CropperContainer>

                  <CropperContainer>
                    <CropperImage
                      title="معرفی نامه نماینده"
                      cropText="تصویر معرفی نامه نماینده را آپلود کنید"
                      name="RepresentativesLetterPhoto"
                    />
                  </CropperContainer>
                </LeftLayout>

                <SubmitButtonContainer>
                  <SubmitButton
                    type="submit"
                    disabled={isLoading}
                    isLoading={isLoading}>
                    {isLoading ? <Spinner /> : "ثبت اطلاعات شرکت"}
                  </SubmitButton>
                </SubmitButtonContainer>
              </LeftContent>
            </ResponsiveContainer>
          </Content>
        </MainContainer>
      </Form>
    </Formik>
  );
}
