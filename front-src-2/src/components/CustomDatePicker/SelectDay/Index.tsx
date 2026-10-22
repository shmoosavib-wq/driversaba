import React, { useEffect, useState } from "react";
import Select from "react-select";

import {
  customDatePickerStyles,
  DropDownContainerSelect,
  ErrorParagraphSelect,
  MainContainerSelect,
} from "../style";

interface PropsType {
  formik: any;
  isKabise: boolean;
}

const SelectDay = React.forwardRef(
  ({ formik, isKabise }: PropsType, ref: any) => {
    const [date, setDate] = useState([]);

    // create date options
    const createDay = (start: number, end: number) => {
      const newDates = [];

      for (let index = start; index <= end; index++) {
        newDates.push({
          value: index < 10 ? `0${index}` : index,
          label: index.toString(),
        });
      }
      setDate([...newDates]);
    };

    useEffect(() => {
      createDay(1, 31);
    }, []);

    // useEffect(() => {
    //   if (isKabise) {
    //     if (formik?.values?.months?.label === "اسفند") {
    //       createDay(1, 30);
    //     } else if ([7, 8, 9, 10, 11].includes(formik?.values?.months?.value)) {
    //       createDay(1, 30);
    //     } else {
    //       createDay(1, 31);
    //     }
    //   } else {
    //     if (formik?.values?.months?.label === "اسفند") {
    //       createDay(1, 29);
    //     } else if ([7, 8, 9, 10, 11].includes(formik?.values?.months?.value)) {
    //       createDay(1, 30);
    //     } else {
    //       createDay(1, 31);
    //     }
    //   }
    // }, [formik?.values?.months, isKabise]);

    return (
      <MainContainerSelect>
        <DropDownContainerSelect>
          <Select
            maxMenuHeight={150}
            // isDisabled={
            //   formik.values["years"] === "" || formik.values["months"] === ""
            // }
            ref={ref}
            isRtl
            options={date}
            value={formik.values["days"]}
            styles={customDatePickerStyles}
            placeholder="روز"
            onInputChange={(e) =>
              e.replace(/[A-Za-z\u0600-\u06FF\s]/g, "").substring(0, 2)
            }
            onChange={(e) => {
              formik.setFieldValue("days", e);
            }}
            onBlur={() =>
              setTimeout(() => {
                formik.setFieldTouched("days", true);
              }, 50)
            }
          />
        </DropDownContainerSelect>
        {/* {formik.touched["days"] && formik.errors["days"] && (
          <ErrorParagraphSelect>{formik.errors["days"]}</ErrorParagraphSelect>
        )} */}
      </MainContainerSelect>
    );
  }
);

export default SelectDay;
