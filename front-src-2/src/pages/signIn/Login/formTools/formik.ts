import * as Yup from "yup";

export const initialValues = {
  MobileNumber: "",
};

export const validationSchema = Yup.object({
  MobileNumber: Yup.string()
    .matches(/^09([0-9]){9}$/, "شماره همراه وارد شده معتبر نیست")
    .required("شماره همراه را وارد کنید"),
});
