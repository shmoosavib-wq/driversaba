import * as Yup from "yup";

export const initialValues = {
  RemittanceNumber: "",
};

export const validationSchema = Yup.object({
  RemittanceNumber: Yup.string().required(" "),
});
