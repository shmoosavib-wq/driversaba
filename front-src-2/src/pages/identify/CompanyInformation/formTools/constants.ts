export const CompanyInfoItems = [
  {
    label: "نام شرکت",
    placeholder: "مثال : صبا بار",
    name: "CompanyName",
    type: "text",
  },
  {
    label: "شماره تلفن شرکت",
    placeholder: "مثال : 02134994315 ",
    name: "CompanyPhoneNumber",
    type: "number",
    maxLength: 11,
  },
  {
    label: "کد پستی شرکت",
    placeholder: "مثال : 1234567890",
    name: "CompanyPostCode",
    type: "number",
    maxLength: 10,
  },
  {
    label: "شناسه ملی شرکت",
    placeholder: "مثال : 123986738",
    name: "CompanyNationalId",
    type: "number",
  },
  {
    title: "شهر نمایندگی",
    placeholder: "مثال : تهران",
    name: "CompanyCityId",
    type: "select",
  },
];


export const services = [
  {
    label: "شهری",
    value: 1,
  },
  {
    label: "استانی",
    value: 2,
  },
  {
    label: "سراسری",
    value: 3,
  },
  {
    label: "هوشمند",
    value: 5,
  },
];