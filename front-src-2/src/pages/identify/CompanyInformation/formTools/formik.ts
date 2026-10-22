import * as Yup from "yup";

const ROLE: any = localStorage.getItem("ROLE");

export const initialValues = {
  CompanyName: "",
  CompanyPhoneNumber: "",
  CompanyPostCode: "",
  CompanyNationalId: "",
  CompanyAddress: "",
  CompanyCityId: "",
  CompanyLocationStatus: "",
  CargoPermitPhoto: null,
  CompanyLogoPhoto: null,
  RepresentativesLetterPhoto: null,
  ROLE: ROLE,
};

export const validationSchema = Yup.object({
  CompanyName: Yup.string().required(" ").matches(
    //  @ts-ignore
    "^[\u0600-\u06FF\u0020\u2000-\u200F\u2028-\u202F0-9]+$",
    "از حروف فارسی استفاده کنید"
  ),
  CompanyPhoneNumber: Yup.string().required(" "),
  CompanyPostCode: Yup.string()
    .required(" ")
    .matches(/^.{10}$/, "کد پستی باید 10 رقم باشد"),
  CompanyNationalId: Yup.string()
    .required(" ")
    .matches(/^.{10}$/, "شناسه ملی باید 10 رقم باشد"),
  CompanyCityId: Yup.string().required(" "),
  CompanyLocationStatus: Yup.string().when("ROLE", (ROLE, schema) =>
    // @ts-ignore
    ROLE == "logisticservices"
      ? Yup.string().required(" ")
      : Yup.string().notRequired()
  ),

  CompanyAddress: Yup.string().required(" "),
  CargoPermitPhoto: Yup.mixed().when("ROLE", (ROLE, schema) =>
    // @ts-ignore
    ROLE == "logisticservices"
      ? Yup.string().required(" ")
      : Yup.string().notRequired()
  ),
  CompanyLogoPhoto: Yup.mixed().required(" "),
  RepresentativesLetterPhoto: Yup.mixed().required(" "),
});
