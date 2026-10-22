import React from "react";
import Select from "react-select";

import {
  customDatePickerStyles,
  DropDownContainerSelect,
  ErrorParagraphSelect,
  MainContainerSelect,
} from "../style";

interface PropsType {
  option: [];
  formik: any;
  setIsKabise?: (event: boolean) => void;
}

const SelectYear = React.forwardRef(
  ({ option, formik, setIsKabise }: PropsType, ref: any) => {
    return (
      <MainContainerSelect>
        <DropDownContainerSelect>
          <Select
            maxMenuHeight={150}
            ref={ref}
            isRtl
            options={option}
            value={formik.values["years"]}
            styles={customDatePickerStyles}
            placeholder="سال"
            onInputChange={(e) =>
              e.replace(/[A-Za-z\u0600-\u06FF\s]/g, "").substring(0, 4)
            }
            onChange={(e) => {
              formik.setFieldValue("years", e);
              // formik.setFieldValue("months", "");
              // formik.setFieldValue("days", "");

              // if (e.label % 4 === 0) {
              //   setIsKabise(true);
              // } else {
              //   setIsKabise(false);
              // }
            }}
            onBlur={() =>
              setTimeout(() => {
                formik.setFieldTouched("years", true);
              }, 50)
            }
          />
        </DropDownContainerSelect>
        {/* {formik.touched["years"] && formik.errors["years"] && (
          <ErrorParagraphSelect>{formik.errors["years"]}</ErrorParagraphSelect>
        )} */}
      </MainContainerSelect>
    );
  }
);

export default SelectYear;
