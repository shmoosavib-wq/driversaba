import styled from "styled-components";

import { getShebaInfo } from "@persian-tools/persian-tools";
import { useEffect, useState } from "react";

import Image from "../global/Image";
import Typography from "../Typography";

interface bankCartType {
  name: string;
  number: string;
  onClick: () => void;
  isSelected: boolean;

  IsSheba?: boolean;
  shebaInfo?: any;
}

export default function BankCard({
  name,
  number,
  onClick,
  isSelected,
  IsSheba,
  shebaInfo,
}: bankCartType) {
  const [shebaCode, setShebaCode] = useState<string>();
  useEffect(() => {
    if (IsSheba) {
      setShebaCode(getShebaInfo(shebaInfo?.ShebaNumber)?.code);
    }
  }, []);

  return (
    <CardContainer onClick={onClick} isSelected={isSelected}>
      <ItemContainer>
        <Image
          src={`/payment/bankIcon/${
            IsSheba && shebaCode ? shebaCode : "saba-logo"
          }.svg`}
        />
        <Image src="/loadState/shetab.svg" />
      </ItemContainer>
      <ItemContainer>
        <Typography type="ParagraphMedium">{name}</Typography>
        <Typography type="ParagraphMedium" dir="ltr">
          {number}
        </Typography>
      </ItemContainer>
    </CardContainer>
  );
}

export const CardContainer = styled.div<{ isSelected }>`
  display: flex;
  flex-wrap: wrap;
  padding: 12px 24px 16px 24px;
  gap: 16px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.isSelected ? "#01ACBC" : "#e8e8e8")};
  width: 100%;
  cursor: pointer;
`;

export const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
