import { useState } from "react";

import RemittanceNumber from "../RemittanceNumber";
import WayBillInfo from "../WayBillInfo";

export default function Remittence({ nextStep }) {
  const [nextPage, setNextPage] = useState(false);
  const [remittanceInfo, setRemittanceInfo] = useState(false);
  return (
    <>
      {nextPage ? (
        <WayBillInfo
          nextStep={nextStep}
          setNextPage={setNextPage}
          remittanceInfo={remittanceInfo}
        />
      ) : (
        <RemittanceNumber
          setRemittanceInfo={setRemittanceInfo}
          setNextPage={setNextPage}
        />
      )}
    </>
  );
}
