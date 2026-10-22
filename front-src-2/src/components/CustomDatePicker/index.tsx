import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "@amir04lm26/react-modern-calendar-date-picker";
import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";

import theme from "@/theme";
import { DatePickerForm } from "@/components/CustomDatePicker/formTools/formik";
import { SelectDay, SelectMonth, SelectYear, DynamicYears } from "../index";
import Typography from "../Typography";

import {
  MainContainer,
  Container,
  DatePickerDiv,
  DatePickerImg,
  DropDownContainer,
  Span,
  DatePickerTitle,
  ErrorImg,
  ErrorContainer,
} from "./style";
import "./styles.css";

interface PropsType {
  startYear?: number;
  endYear?: number;
  onDateChange?: (date: any) => void;
  name?: string;
  title?: string;
}

interface MonthType {
  label: string;
  value: number;
}

const months = [
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

const CustomDatePicker = ({
  startYear = 1300,
  endYear = 1403,
  onDateChange,
  name,
  title,
}: PropsType) => {
  const dayInput = useRef<HTMLSelectElement>();
  const monthInput = useRef<HTMLSelectElement>();
  const yearInput = useRef<HTMLSelectElement>();

  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isKabise, setIsKabise] = useState<boolean>(false);

  const formik = useFormik({
    ...DatePickerForm,
  });

  // set dynamic year to SelectYear component
  const yearsOptions: any = DynamicYears(startYear, endYear);

  // date-picker handler
  const dateChangeHandler = (date: any) => {
    setSelectedDate(date);

    const jsDate = new Date(date?.year, date?.month - 1, date?.day);
    const addLeadingZero = (number: number) =>
      number < 10 ? `0${number}` : number;

    const formattedDate = `${jsDate.getFullYear()}/${addLeadingZero(
      jsDate.getMonth() + 1
    )}/${addLeadingZero(jsDate.getDate())}`;

    let splitDate: any = formattedDate.split("/");

    let datePickerMonthSelect: MonthType;
    for (let index: number = 0; index <= months.length; index++) {
      // find name of the month
      if (index === parseInt(splitDate[1])) {
        datePickerMonthSelect = {
          value: splitDate[1],
          label: months[index - 1],
        };
      }
    }

    formik.setFieldValue("days", {
      value: splitDate[2],
      label: splitDate[2],
    });
    formik.setFieldValue("months", {
      value: splitDate[1],
      label: datePickerMonthSelect?.label,
    });
    formik.setFieldValue("years", {
      value: splitDate[0],
      label: splitDate[0],
    });
  };

  var jalaali = require("jalaali-js");
  // sending the selected day, month and year to the outside of the component by callback function
  useEffect(() => {
    if (onDateChange) {
      const { years, months, days } = formik?.values;

      const formattedDate = `${years?.value}/${months.value}/${days.value}`;

      const isValidDate = jalaali.isValidJalaaliDate(
        years.value,
        months.value,
        days.value
      );

      formik.setFieldValue("isValidationDates", isValidDate);

      onDateChange({
        persianBirthDate: formattedDate,
        isValidationDates: formik.values.isValidationDates,
      });
    }
  }, [formik?.values]);

  const touched =
    formik.touched.days ?? formik.touched.months ?? formik.touched.years;

  const error =
    formik.errors.days ?? formik.errors.months ?? formik.errors.years;

  return (
    <>
      <DatePickerTitle>{title}</DatePickerTitle>
      <MainContainer>
        <Container>
          <DropDownContainer>
            <SelectDay isKabise={isKabise} formik={formik} ref={dayInput} />
            <Span />
            <SelectMonth formik={formik} ref={monthInput} />
            <Span />
            <SelectYear
              setIsKabise={setIsKabise}
              formik={formik}
              ref={yearInput}
              option={yearsOptions}
            />
          </DropDownContainer>
          <DatePickerDiv>
            <DatePickerImg
              src={"/images/icons/customDatePicker/date.svg"}
              alt="datePickerIcon"
            />
            <DatePicker
              calendarPopperPosition="bottom"
              colorPrimary="#01acbc"
              value={selectedDate}
              onChange={dateChangeHandler}
              locale="fa"
              wrapperClassName="my-custom-datepicker-div-element"
              inputClassName="my-custom-datepicker-input"
              shouldHighlightWeekends
            />
          </DatePickerDiv>
        </Container>
      </MainContainer>

      {formik.values.days &&
        formik.values.months &&
        formik.values.years &&
        !formik.values.isValidationDates && (
          <ErrorContainer>
            <ErrorImg src="/images/icons/inputIcon/erroricon.svg" alt="error" />
            <Typography
              title="تاریخ وارد شده معتبر نیست"
              type="ParagraphSmall"
              color={theme.colors.Red}
            />
          </ErrorContainer>
        )}
      {touched && error && (
        <ErrorContainer>
          <ErrorImg src="/images/icons/inputIcon/erroricon.svg" alt="error" />
          <Typography
            // @ts-ignore
            title={error}
            type="ParagraphSmall"
            color={theme.colors.Red}
          />
        </ErrorContainer>
      )}
    </>
  );
};

export default CustomDatePicker;
