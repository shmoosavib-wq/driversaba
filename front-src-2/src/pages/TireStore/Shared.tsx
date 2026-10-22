import { ReactNode } from "react";
import { Store, Header } from "./style";

export const Screen = ({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) => (
  <Store>
    <Header>
      <button type="button" onClick={onBack} aria-label="بازگشت">
        <img src="/images/icons/arrow-left.svg" alt="" />
      </button>
      <b>{title}</b>
      <span />
    </Header>
    {children}
  </Store>
);
