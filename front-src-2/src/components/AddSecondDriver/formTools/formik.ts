import * as Yup from "yup";

// === Second Driver Form ===
export const initialValuesSecondDriver = {
  nationalCode: "",
  mobileNumber: "",
};

export const validationSchemaSecondDriver = Yup.object({
  nationalCode: Yup.string()
    .matches(/^[0-9]{10}$/, "کد ملی باید 10 رقم و عدد باشد")
    .required(" "),
  mobileNumber: Yup.string()
    .matches(/^09([0-9]){9}$/, "شماره همراه وارد شده معتبر نیست")
    .required(" "),
});
