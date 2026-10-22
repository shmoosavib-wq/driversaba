import { useField } from "formik";

import {
  MainContainer,
  ErrorMassage,
  TextAreaContainer,
  TextAreaLabel,
  TextAreaContent,
} from "./style";

interface PropsType {
  title?: string;
  name: string;
}

export default function TextArea({ title, name }: PropsType) {
  const [field, meta, helpers] = useField({ name });

  let error = meta.touched && meta.error ? meta.error : false;
  return (
    <MainContainer dir="rtl">
      {error && (
        <ErrorMassage
          src="/images/icons/inputIcon/erroricon.svg"
          alt="error"
        />
      )}
      <TextAreaContainer>
        <TextAreaLabel>{title}</TextAreaLabel>
        <TextAreaContent
          name={name}
          BorderColor={meta.touched && meta.error}
          placeholder="متن"
          onChange={(e) => field.onChange(e)}
        />
      </TextAreaContainer>
    </MainContainer>
  );
}
