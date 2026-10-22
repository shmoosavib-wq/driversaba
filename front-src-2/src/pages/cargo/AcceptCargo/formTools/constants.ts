interface AddTruckTypeValuesType {
  name: string;
  id: number;
}

export const AddTruckTypeValues: AddTruckTypeValuesType[] = [
  {
    name: "تریلی",
    id: 13,
  },
  {
    name: "وانت",
    id: 8,
  },
  {
    name: "خاور وکامیونت",
    id: 10,
  },
  {
    name: "کامیون تک محوره",
    id: 11,
  },
  {
    name: "کامیون دو محوره",
    id: 12,
  },
];

interface SecondDriverFieldType {
  id: number;
  label: string;
  maxLength: number;
  placeholder: string;
  name: string;
  type: string;
  mask: string;
}
export const SecondDriverField: SecondDriverFieldType[] = [
  {
    id: 1,
    label: "کد ملی راننده را وارد کنید",
    maxLength: 10,
    placeholder: "مثلا 44934834",
    name: "nationalCode",
    type: "tel",
    mask: "0000000000",
  },
  {
    id: 2,
    label: "شماره همراه راننده را وارد کنید",
    maxLength: 11,
    placeholder: "مثلا 09123456789",
    name: "mobileNumber",
    type: "tel",
    mask: "00000000000",
  },
];
