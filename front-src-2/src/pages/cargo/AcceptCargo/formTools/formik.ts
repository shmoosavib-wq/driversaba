import * as Yup from "yup";

export const initialValue = {
  LogisticRequestAppId: null,
  TransportEquipmentId: null,
  SecondDriverId: null,
};

export const validationSchema = Yup.object({
  LogisticRequestAppId: Yup.number().nullable(" "),
  TransportEquipmentId: Yup.number().nullable(" "),
  SecondDriverId: Yup.number().nullable(),
});

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
