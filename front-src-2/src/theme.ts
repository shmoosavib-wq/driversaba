import { createTheme, LightTheme, Theme } from "baseui";

const primitives: Theme = {
  ...LightTheme,
  // @ts-ignore
  colors: {
    Gray50: "rgba(175, 175, 175, 0.4)",
    Gray100: "#F3F3F3",
    Gray150: "#D2D2D2",
    Gray200: "#E8E8E8",
    Gray250: "#E0E0E0",
    Gray300: "#D9D9D9",
    Gray400: "#A6A6A6",
    Gray500: "#7C7C7C",
    Gray600: "#5E5E5E",
    LinearGray: "#D9D9D9",
    DisableBackground: "rgba(43, 43, 43, 0.6)",
    Black: "#000000",
    Red: "#DE1135",
    Green: "#0E8345",
    White: "#ffffff",
    Yellow: "#FFC727",
    Blue: "#01ACBC",
  },

  typography: {
    HeadingLarge: {
      fontFamily: "IRANSansX",
      fontSize: "28px",
      fontWeight: 600,
      lineHeight: "36px",
    },
    HeadingMedium: {
      fontFamily: "IRANSansX",
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: "32px",
    },
    HeadingSmall: {
      fontFamily: "IRANSansX",
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "28",
    },
    HeadingXSmall: {
      fontFamily: "IRANSansX",
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "28px",
    },
    // @ts-ignore
    LabelXLarge: {
      fontFamily: "IRANSansX",
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "28px",
    },
    LabelLarge: {
      fontFamily: "IRANSansX",
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "22px",
    },
    LabelMedium: {
      fontFamily: "IRANSansX",
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: "20px",
    },
    LabelSmall: {
      fontFamily: "IRANSansX",
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: "18px",
    },

    ParagraphXLarge: {
      fontFamily: "IRANSansX",
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "24px",
    },
    ParagraphLarge: {
      fontFamily: "IRANSansX",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "20px",
    },
    ParagraphMedium: {
      fontFamily: "IRANSansX",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
    },
    ParagraphSmall: {
      fontFamily: "IRANSansX",
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "16px",
    },
    ParagraphXSmall: {
      fontFamily: "IRANSansX",
      fontSize: "8px",
      fontWeight: 400,
      lineHeight: "15px",
    },
  },
};

export default createTheme(primitives);
