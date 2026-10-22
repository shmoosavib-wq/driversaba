import * as Yup from "yup";

export const AddVehicleForm = {
  validationSchema: Yup.object().shape({
    LoaderTypeId: Yup.string().required(" ").nullable(),
    BrandId: Yup.string().required(" "),
    FuelTypeId: Yup.string().required(" "),
    EquipmentConstructionYear: Yup.number()
      .required(" ")
      .test(
        "is-valid-range",
        "سال وارد شده معتبر نیست",
        (value) => value >= 1300 && value <= 2030
      ),
    EquipmentSmartNumber: Yup.string()
      .required(" ")
      .length(7, "شماره هوشمند باید 7 رقم باشد"),
    SerialNumber: Yup.string().required(" ").length(13, "پلاک ناقص است"),
  }),
};
