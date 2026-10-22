import React from "react";
import Select from "react-select";

import {
  customDatePickerStyles,
  DropDownContainerSelect,
  ErrorParagraphSelect,
  MainContainerSelect,
} from "../style";

// months for date picker
let months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
let CreatMonths = [];
for (let index = 0; index < months.length; index++) {
  CreatMonths.push({
    value: index < 9 ? `0${index + 1}` : index + 1,
    label: months[index],
  });
}

const SelectMonth = React.forwardRef(({ formik }: any, ref: any) => {
  return (
    <MainContainerSelect>
      <DropDownContainerSelect>
        <Select
          maxMenuHeight={150}
          // isDisabled={formik.values["years"] === ""}
          ref={ref}
          isRtl
          options={CreatMonths}
          value={formik.values["months"]}
          styles={customDatePickerStyles}
          placeholder="ماه"
          onInputChange={(e) =>
            e.replace(/[^A-Za-z\u0600-\u06FF\s]/g, "").substring(0, 3)
          }
          onChange={(e) => {
            formik.setFieldValue("months", e);
            // formik.setFieldValue("days", "");
          }}
          onBlur={() =>
            setTimeout(() => {
              formik.setFieldTouched("months", true);
            }, 50)
          }
        />
      </DropDownContainerSelect>
      {/* {formik.touched["months"] && formik.errors["months"] && (
        <ErrorParagraphSelect>{formik.errors["months"]}</ErrorParagraphSelect>
      )} */}
    </MainContainerSelect>
  );
});

export default SelectMonth;
