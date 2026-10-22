import * as Yup from "yup";

export const DatePickerForm: any = {
  initialValues: {
    days: "",
    months: "",
    years: "",
    isValidationDates: false,
  },
  validationSchema: Yup.object({
    days: Yup.object().required("تاریخ تولد ناقص است"),
    months: Yup.object().required("تاریخ تولد ناقص است"),
    years: Yup.object().required("تاریخ تولد ناقص است"),
    isValidationDates: Yup.boolean()
      .oneOf([true], "لطفاً تاریخ معتبر وارد کنید")
      .required(""),
  }),
};
