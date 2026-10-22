import { useState, useEffect, useRef } from "react";
import { useField } from "formik";
import { digitsArToEn, digitsFaToEn } from "@persian-tools/persian-tools";

import { customCharPlateStyles } from "@/components/CustomDatePicker/style";

import {
  MainContainer,
  ShowError,
  Label,
  Container,
  ImageContainer,
  PlateImage,
  PlateNumberOne,
  PlateChar,
  StyledSelect,
  PlateNumberTwo,
  PlateNumberThree,
  PlateNumberThreeLabel,
  PlateAfterContent,
  PlatNum1,
  PlatNum2,
  PlatNum3,
} from "./style";

interface PropsType {
  name: string;
  plateItem?: string;
}

const digit = /^[\u06F0-\u06F90-9]+$/;
const plateCharDefault = {
  value: 0,
  label: "ع",
};

export default function Plate({ name, plateItem = "" }: PropsType) {
  const firstField = useRef(null);
  const secondField = useRef(null);
  const thirdField = useRef(null);
  const lastField = useRef(null);

  const [inputValue, setInputValue] = useState({
    plateNum1: "",
    plateChar: "",
    plateNum2: "",
    plateNum3: "",
  });

  const [field, meta, helpers] = useField({ name });
  let error = meta.touched && meta.error ? meta.error : false;

  const getPlate = plateItem !== "" && plateItem?.split(".");

  const charPlate = {
    value: 0,
    label: getPlate && getPlate[1],
  };

  const alphabet = [];
  for (let char of "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی") {
    alphabet.push({ value: alphabet.length + 1, label: char });
  }

  const handleInputValue = (e: any, inputName: string) => {
    setInputValue((prevState: any) => {
      const updateInputValue: any = { ...prevState };

      if (inputName === "plateChar") {
        updateInputValue[inputName] = e.label;
      } else {
        updateInputValue[inputName] = e;
      }

      return updateInputValue;
    });
  };

  useEffect(() => {
    if (!getPlate) {
      // === set default value to palte-char ===
      setInputValue((prevState) => ({
        ...prevState,
        plateChar: "ع",
      }));
    }
  }, []);

  useEffect(() => {
    const { plateNum1, plateChar, plateNum2, plateNum3 } = inputValue;

    const formattedPlate = `${plateNum1 === "" ? getPlate[0] : plateNum1}\u202A ${plateChar === "" ? getPlate[1] : plateChar} \u202C${plateNum2 === "" ? getPlate[2] : plateNum2} ${plateNum3 === "" ? getPlate[3] : plateNum3}`;

    helpers.setValue(formattedPlate);
  }, [inputValue]);

  // === convert plate-number to english number ===
  const convertNumber = (e) => {
    let val = e.target.value;

    const englishNumbersRegex = /^[0-9]*$/;
    const persianNumbersRegex = /[\u06F0-\u06F9]/;
    const arabicNumbersRegex = /[\u0660-\u0669]/;

    if (
      !englishNumbersRegex.test(val) &&
      !arabicNumbersRegex.test(val) &&
      !persianNumbersRegex.test(val)
    )
      return "0";

    if (arabicNumbersRegex.test(val)) {
      return digitsArToEn(val);
    } else if (persianNumbersRegex.test(val)) {
      return digitsFaToEn(val);
    } else return val;
  };

  return (
    <MainContainer>
      {error && <ShowError>{error}</ShowError>}
      <Label>پلاک ناوگان</Label>
      {/* @ts-ignore */}
      <Container error={error}>
        <ImageContainer>
          <PlateImage src="/images/plate/plate.svg" alt="plate" />
        </ImageContainer>

        <PlateNumberOne>
          <PlatNum1
            type="tel"
            defaultValue={getPlate && getPlate[0]}
            ref={firstField}
            maxLength={2}
            mask={[digit, digit]}
            placeholder="_ _"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;
              let num2en = convertNumber(e);

              handleInputValue(num2en, "plateNum1");

              if (value.length >= 2) {
                if (
                  secondField?.current.state.selectValue[0]?.label === undefined
                ) {
                  secondField?.current.focus();
                } else if (thirdField?.current.element.value.length < 3) {
                  thirdField.current.element.focus();
                }
              }
            }}
          />
        </PlateNumberOne>

        <PlateAfterContent />
        <PlateChar>
          <StyledSelect
            defaultValue={getPlate ? charPlate : plateCharDefault}
            ref={secondField}
            name={name}
            options={alphabet}
            isRtl
            placeholder="_"
            styles={customCharPlateStyles}
            onInputChange={(e) =>
              e.replace(/^[A-Za-z0-9]+$/, "").substring(0, 1)
            }
            onChange={(e: any) => {
              handleInputValue(e, "plateChar");

              if (e.label.length >= 1) {
                if (thirdField?.current.element.value.length < 3) {
                  thirdField.current.element.focus();
                }
              }
            }}
          />
        </PlateChar>

        <PlateAfterContent />

        <PlateNumberTwo>
          <PlatNum2
            type="tel"
            defaultValue={getPlate && getPlate[2]}
            ref={thirdField}
            maxLength={3}
            mask={[digit, digit, digit]}
            placeholder="_ _ _"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;
              let num2en = convertNumber(e);

              handleInputValue(num2en, "plateNum2");

              if (value.length >= 3) {
                if (lastField?.current.element.value.length < 2) {
                  lastField?.current.element.focus();
                }
              }
            }}
          />
        </PlateNumberTwo>

        <PlateAfterContent />

        <PlateNumberThree>
          <PlateNumberThreeLabel>ایران</PlateNumberThreeLabel>
          <PlatNum3
            type="tel"
            defaultValue={getPlate && getPlate[3]}
            ref={lastField}
            maxLength={2}
            mask={[digit, digit]}
            placeholder="_ _"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value;
              let num2en = convertNumber(e);

              handleInputValue(num2en, "plateNum3");

              if (value.length >= 2) {
                if (firstField?.current.element.value === "") {
                  firstField?.current.element.focus();
                } else if (
                  secondField?.current.state.selectValue[0]?.label === undefined
                ) {
                  secondField?.current.focus();
                } else if (thirdField?.current.element.value === "") {
                  thirdField?.current.element.focus();
                }
              }
            }}
          />
        </PlateNumberThree>
      </Container>
    </MainContainer>
  );
}
