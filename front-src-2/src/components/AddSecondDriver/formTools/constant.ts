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
