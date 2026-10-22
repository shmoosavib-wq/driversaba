import React, { Fragment } from "react";
import { Toast, KIND, ToasterContainer } from "baseui/toast";

interface ToastProps {
  toastMode: string;
  toastText: string;
}

const ShowToast = ({ toastMode, toastText }: ToastProps) => {
  return (
    <Fragment>
      <ToasterContainer />
      <Toast kind={KIND[toastMode]}>{toastText}</Toast>
    </Fragment>
  );
};

export default ShowToast;
