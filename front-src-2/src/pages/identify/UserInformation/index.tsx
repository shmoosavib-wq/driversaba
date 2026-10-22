import { Form, Formik } from "formik";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { getUserInfo, postUserInfo } from "@/services/identify/identify-api";
import ButtonKit from "@/components/Button";
import DropDown from "@/components/DropDown";
import { InputKit } from "@/components";
import CropperImage from "@/components/CropperImage";

import {
  FormContainer,
  Loading,
  UploadSection,
  UserInfoContainer,
  UserInfoSection,
  ButtonContainer,
} from "@/pages/identify/UserInformation/styles";
interface UserInfoForm {
  FullName?: string;
  UserProfile: any;
  CityId: number;
  DegreeEducationId: any;
}

const UserInformation = ({ onNext = null }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { mutate: postForm, isLoading: pending } = useMutation(
    (data: UserInfoForm) => postUserInfo(data),
    {
      onSuccess: () => {
        if (pathname.includes("editInformation")) {
          navigate(-1);
        } else onNext();
      },
    }
  );

  const { data, isLoading } = useQuery("USERINFO", getUserInfo, {});

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        UserProfile: data.ProfileImage || null,
        FullName: data.FullName || "",
        CityId:
          (data.ResidentUser.value === 0 ? null : data.ResidentUser) || null,
        DegreeEducationId:
          (data.Education.value === 0 ? null : data.Education) || null,
      }}
      onSubmit={(val) => {
        // Remove FullName from the form data
        const { FullName, ...formData } = val;
        postForm(formData);
      }}>
      <Form>
        <UserInfoSection routeStyle={pathname.includes("Identity")}>
          <UserInfoContainer>
            <FormContainer>
              <InputKit
                placeholder="نام"
                name="FullName"
                label="نام و نام خانوادگی"
                disabled
                value={data.FullName}
              />

              <DropDown
                shortURL={"Degrees"}
                title={"تحصیلات"}
                name="DegreeEducationId"
                placeHolder={"انتخاب کنید"}
                label="تحصیلات (اختیاری)"
              />
              <DropDown
                shortURL={"CitiesAndTheirProvinces"}
                title={"شهر محل زندگی"}
                placeHolder={"انتخاب کنید"}
                name="CityId"
                label="شهر محل زندگی (اختیاری)"
                searchAble={true}
              />
            </FormContainer>

            <UploadSection>
              <CropperImage
                title="تصویر پروفایل (اختیاری)"
                cropText="تصویر خود را اپلود کنید"
                name="UserProfile"
              />

              <ButtonContainer>
                <ButtonKit
                  text={"ثبت و ادامه"}
                  theme={"blue"}
                  type="submit"
                  shape={window.innerWidth >= 1024 ? "pill" : "default"}
                  isLoading={pending}
                  disabled={false}
                  width="100%"
                  height="50px"
                />
              </ButtonContainer>
            </UploadSection>
          </UserInfoContainer>
        </UserInfoSection>
      </Form>
    </Formik>
  );
};

export default UserInformation;
