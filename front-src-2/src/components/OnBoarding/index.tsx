import Joyride, { STATUS, ACTIONS, Step, CallBackProps } from "react-joyride";
import { useSearchParams } from "react-router-dom";

import { OnBoardingType } from "@/types";

import "./style.css";

interface PropsType {
  steps: Step[];
  open: boolean;
  onChange: (joyrideStatus: boolean) => void;
}

export default function OnBoarding({ steps, open, onChange }: PropsType) {
  const [searchParams] = useSearchParams();
  const findTab = searchParams.get("t");

  const handleJoyrideCallback = ({ action, status }: CallBackProps) => {
    let key = "";

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      // onChange(false);
      if (findTab === "list") {
        key = OnBoardingType.HomeList;
      } else if (findTab === "profile") {
        key = OnBoardingType.HomeProfile;
      }

      if (key) localStorage.setItem(key, "false");
    }

    if (action === ACTIONS.CLOSE) {
      onChange(false);
      localStorage.setItem(
        findTab === "list"
          ? OnBoardingType.HomeList
          : OnBoardingType.HomeProfile,
        "false"
      );
    }
  };

  return (
    <Joyride
      steps={steps}
      continuous
      scrollToFirstStep
      showSkipButton
      disableOverlayClose
      callback={handleJoyrideCallback}
      hideBackButton
      disableScrollParentFix
      disableScrolling
      run={open}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#01ACBC",
          width: "258px",
        },
        buttonSkip: {
          color: "#01ACBC",
        },
        buttonNext: {
          width: "56px",
          height: "36px",
          padding: "0 12px",
          borderRadius: "28px",
          fontSize: "12px",
          fontWeight: "600",
        },
      }}
      locale={{
        back: "برگشت",
        close: "بستن",
        last: "پایان",
        next: "ادامه",
        skip: "بی خیال",
      }}
    />
  );
}
