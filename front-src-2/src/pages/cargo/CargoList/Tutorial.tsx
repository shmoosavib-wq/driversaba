import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { CargoListOnboarding } from "@/data/cargo-list-onboarding";
import OnBoarding from "@/components/OnBoarding";
import { OnBoardingType } from "@/types";

export default function Tutorial({ data }) {
  const [searchParams] = useSearchParams();
  const findTab = searchParams.get("t");

  const [show, setShow] = useState(false);

  const hasData = data?.pages[0].results.length !== 0;

  useEffect(() => {
    if (data && findTab === "list") {
      if (hasData) {
        const isShow = localStorage[OnBoardingType.HomeList]
          ? JSON.parse(localStorage[OnBoardingType.HomeList])
          : true;

        setShow(isShow);
      }
    }
  }, [findTab, data, hasData]);

  if (!show) return;

  return (
    <OnBoarding steps={CargoListOnboarding} open={show} onChange={setShow} />
  );
}
