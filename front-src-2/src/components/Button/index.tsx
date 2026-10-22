import { Button, SHAPE, ButtonProps } from "baseui/button";

import "./style.css";
import { Override } from "baseui/helpers/overrides";

interface ButtonKitProps extends ButtonProps {
  text?: React.ReactNode;
  theme?: "black" | "blue" | "red" | "secondaryRed" | "white";
  isLoading?: boolean;

  width?: string | null;
  height?: string | null;
  fontSize?: string;
  baseOvrride?: Override;
}

const ButtonKit = ({
  text,
  theme,
  isLoading = false,
  disabled = false,
  shape = "default",

  type = "button",
  width = null,
  height = null,
  fontSize = "18px",
  children = null,
  baseOvrride,
  ...rest
}: ButtonKitProps) => {
  return (
    <Button
      type={type}
      shape={SHAPE[shape]}
      isLoading={isLoading}
      overrides={{
        BaseButton: {
          props: {
            className: "button",
          },
          style: {
            fontSize,
            padding: "0px",
            fontFamily: "IRANSansX",
            width: width,
            height: height,
            backgroundColor:
              theme === "black"
                ? "black"
                : theme === "blue"
                  ? "#01ACBC"
                  : theme === "secondaryRed"
                    ? "#DE1135"
                    : "white",
            color:
              theme === "black"
                ? "white"
                : theme === "blue"
                  ? "white"
                  : theme === "red"
                    ? "#DE1135"
                    : theme === "secondaryRed"
                      ? "white"
                      : "black",
            border:
              theme === "black"
                ? "none"
                : theme === "blue"
                  ? "none"
                  : theme === "red"
                    ? "1.4px solid #DE1135"
                    : theme === "white"
                      ? "1.4px solid #D2D2D2"
                      : "1.4px solid #D2D2D2",
            transition: "background-color 0.3s, color 0.3s",
            ":hover": {
              backgroundColor: "#DEDEDE",
              color: "black",
            },
          },

          ...baseOvrride,
        },
        LoadingSpinner: {
          style: {
            borderColor:
              theme === "black"
                ? "white white #01ACBC"
                : theme === "blue"
                  ? "white white black"
                  : "#D2D2D2 #D2D2D2 #01ACBC",
          },
        },
      }}
      disabled={disabled}
      {...rest}>
      {text}
      {children}
    </Button>
  );
};

export default ButtonKit;
