import { useState, useRef, ReactNode } from "react";
import { IMaskInputProps } from "react-imask";
import { Spinner } from "react-activity";
import { useField } from "formik";

import theme from "@/theme";
import Typography from "../Typography";
import Image from "../global/Image";

import {
  Container,
  InputContainer,
  Input,
  Label,
  ErrorContainer,
  InputClear,
  LabelContainer,
  IconContainer,
} from "./style";

// props type check
type PropInformationType = IMaskInputProps<HTMLInputElement> & {
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  name: string;
  value?: string | number;
  maxLength?: number;
  variant?: ReactNode;
  commas?: boolean;
};

const InputKit = ({
  disabled = false,
  isLoading = false,
  label = "",
  maxLength = undefined,
  name = "",
  value,
  mask,
  variant = null,
  commas = false,
  ...rest
}: PropInformationType) => {
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
  const [customClass, setCustomClass] = useState<string>("");

  const [field, meta, helpers] = useField({ name, value });

  let error = meta.touched && meta.error ? meta.error : false;

  const handleNumber = (e: any) => {
    let val = e.currentTarget.value.length;

    if (val === 0) {
      setShowDeleteButton(false);
    } else {
      setShowDeleteButton(true);
    }

    let newClass = "";
    if (typeof maxLength == "number") {
      if (val < maxLength && val > 0) {
        newClass = "active";
      } else if (val <= 0) {
        newClass = "inactive-zero";
      } else if (val === maxLength) {
        newClass = "active-max";
      } else {
        newClass = "on-blur";
      }
    }

    setCustomClass(newClass);
  };

  const formattedValueCommas = (value) => {
    value = value.toString().replace(/\D/g, "");

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Container>
      {label && (
        <LabelContainer>
          <Typography type="LabelMedium">{label}</Typography>
        </LabelContainer>
      )}
      <InputContainer
        disabled={disabled}
        // @ts-ignore
        isError={meta.touched && meta.error}
        ref={inputContainerRef}
        onFocus={() => setCustomClass("on-focus")}
        className={customClass}
        onBlur={() => {
          setCustomClass("");
        }}>
        {!showDeleteButton && error ? (
          <IconContainer>
            {variant && variant}
            <Image src="/icons/inputIcon/erroricon.svg" alt="error" />
          </IconContainer>
        ) : (
          <IconContainer>
            {isLoading ? (
              <Spinner size={14} color="#01ACBC" />
            ) : (
              <>
                {variant && variant}
                <InputClear
                  showDeleteButton={showDeleteButton}
                  onClick={() => {
                    helpers.setValue("");
                    setShowDeleteButton(false);
                    setCustomClass("");
                  }}
                  src="/images/icons/inputIcon/close.svg"
                  alt="close"
                />
              </>
            )}
          </IconContainer>
        )}

        {/* @ts-ignore */}
        <Input
          defaultValue={value}
          disabled={disabled}
          mask={mask}
          unmask={true}
          name={name}
          dir="rtl"
          autoComplete="off"
          ref={inputRef}
          {...field}
          {...rest}
          onChange={(e: any) => {
            handleNumber(e);
            if (commas === true) {
              helpers.setValue(formattedValueCommas(e.target.value));
            } else {
              field.onChange(e);
            }
          }}
        />
      </InputContainer>

      {error && error !== " " && (
        <ErrorContainer>
          <Image src="/icons/inputIcon/erroricon.svg" alt="error" />
          <Typography
            title={error}
            type="ParagraphSmall"
            color={theme.colors.Red}
          />
        </ErrorContainer>
      )}
    </Container>
  );
};

export default InputKit;
