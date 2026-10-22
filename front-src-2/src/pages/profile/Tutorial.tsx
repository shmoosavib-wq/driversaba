import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProfileOnboarding } from "@/data/profile-onboarding";
import OnBoarding from "@/components/OnBoarding";
import { OnBoardingType } from "@/types";

export function Tutorial() {
  const [show, setShow] = useState(false);

  const [searchParams] = useSearchParams();
  const findTab = searchParams.get("t");

  useEffect(() => {
    if (findTab === "profile") {
      const isShow = localStorage[OnBoardingType.HomeProfile]
        ? JSON.parse(localStorage[OnBoardingType.HomeProfile])
        : true;

      setShow(isShow);
    }
  }, [findTab]);

  if (!show) return;

  return (
    <OnBoarding steps={ProfileOnboarding} open={show} onChange={setShow} />
  );
}
