import { useState } from "react";
import { TireCredit, TireOrder } from "@/services/tire-store-api";
import {
  ActiveBuy, ActiveIc, ActiveTx, CcBar, CcBig, CcLab, CcRow, CcSub, CcTxt, CheckRow, ContractLink, ContractText, CreditCard, CtaBar, CtaBtn,
  EmptyFleet, FleetChoice, HomeContent, LinkBtn, SheetHead, StatusCard, StatusHead, Steps,
} from "./style4";
import { Sheet, SheetBody } from "./style2";
import { fleetId, fleetName, fleetPlate, toman } from "./helpers";

type HomeProps = {
  commerceEnabled: boolean;
  credit?: TireCredit;
  activeOrder?: TireOrder;
  onCreditAction: () => void;
  onStore: () => void;
  onActiveOrder: () => void;
};

const Gauge = ({ pct, big, small }: { pct: number; big: string; small: string }) => {
  const r = 40;
  const c = 2 * Math.PI * r;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="9" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeDasharray={c}
        strokeDashoffset={(c * (1 - pct)).toFixed(1)} transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset .8s ease" }} />
      <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="Vazirmatn">{big}</text>
      <text x="50" y="63" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.85)" fontFamily="Vazirmatn">{small}</text>
    </svg>
  );
};

export function Home({ commerceEnabled, credit, activeOrder, onCreditAction, onStore, onActiveOrder }: HomeProps) {
  const status = credit?.status || "None";
  const approved = status === "Approved";
  const limit = credit?.limit || 0;
  const used = credit?.used || 0;
  const remaining = approved ? Math.max(0, limit - used) : 0;
  const ratio = approved && limit > 0 ? remaining / limit : 0;
  const statusText = approved ? "اعتبار فعال برای خرید قسطی تایر" : status === "Pending" ? "درخواست اعتبار در حال بررسی است" : "برای خرید قسطی درخواست اعتبار بده";
  const cta = approved ? "مشاهده فروشگاه تایر" : status === "Pending" ? "مشاهده وضعیت درخواست" : "درخواست اعتبار";
  const orderStatus = activeOrder?.status === "AwaitingSellerApproval" ? "در انتظار بررسی فروشگاه"
    : activeOrder?.status === "AwaitingFirstPayment" ? "در انتظار پرداخت"
      : activeOrder?.status === "Approved" ? "در انتظار تحویل"
        : "در انتظار تأیید دریافت کالا";
  return (
    <HomeContent>
      {!commerceEnabled ? (
        <StatusCard>
          <StatusHead><i /><b>کاتالوگ فروشگاه</b></StatusHead>
          <p>مشاهده‌ی محصولات و قیمت‌ها فعال است؛ ثبت سفارش و پرداخت پس از تکمیل اتصال احراز هویت و ذخیره‌ی پایدار فعال می‌شود.</p>
        </StatusCard>
      ) : <CreditCard>
        <CcTxt>
          <CcLab><i>✦</i> اعتبار خرید تایر</CcLab>
          <CcBig>{toman(remaining)} <small>تومان</small></CcBig>
          <CcSub>{statusText}</CcSub>
          <CcRow><span>استفاده‌شده: <b>{toman(approved ? used : 0)}</b></span><span>{approved ? `${Math.round(ratio * 100).toLocaleString("fa-IR")}٪ باقی است` : "—"}</span></CcRow>
          <CcBar $pct={ratio * 100}><i /></CcBar>
        </CcTxt>
        <Gauge pct={ratio} big={`${Math.round(remaining / 1e6).toLocaleString("fa-IR")}م`} small="باقی‌مانده" />
      </CreditCard>}
      {commerceEnabled && activeOrder && (
        <ActiveBuy onClick={onActiveOrder}>
          <ActiveIc>🛒</ActiveIc>
          <ActiveTx>
            <b>خرید در جریان · {orderStatus}</b>
            <small>سفارش {activeOrder.proformaNumber} · برای دیدن جزئیات و ادامه بزن</small>
          </ActiveTx>
        </ActiveBuy>
      )}
      <CtaBar>
        <CtaBtn type="button" onClick={onStore}>ورود به فروشگاه</CtaBtn>
        {commerceEnabled && !approved && !activeOrder && <LinkBtn type="button" onClick={onCreditAction}>{cta}</LinkBtn>}
      </CtaBar>
    </HomeContent>
  );
}

type SheetProps = {
  status: string;
  fleets: any[];
  loading: boolean;
  onClose: () => void;
  onRegisterFleet: () => void;
  onSubmit: (fleet: number) => void;
  onDemoApprove: () => void;
};

export function CreditSheet({ status, fleets, loading, onClose, onRegisterFleet, onSubmit, onDemoApprove }: SheetProps) {
  const [step, setStep] = useState<"terms" | "fleet">("terms");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [fleet, setFleet] = useState(fleets.length ? fleetId(fleets[0]) : 0);
  const title = status === "Pending" ? "درخواست اعتبار در حال بررسی" : step === "fleet" ? "انتخاب ناوگان" : "درخواست اعتبار خرید تایر";

  const proceed = () => {
    if (fleets.length === 0) return setStep("fleet");
    if (fleets.length === 1) return onSubmit(fleetId(fleets[0]));
    setStep("fleet");
  };

  return (
    <Sheet onClick={onClose}>
      <SheetBody onClick={(e) => e.stopPropagation()}>
        <SheetHead><b>{title}</b><button aria-label="بستن" onClick={onClose}>×</button></SheetHead>
        {status === "Pending" ? (
          <>
            <p>احراز هویت شما انجام شده و درخواست اعتبار برای صبابار ارسال شده است. نتیجه را همین‌جا می‌بینی.</p>
            <StatusCard>
              <StatusHead><i /><b>در انتظار بررسی اعتبار</b></StatusHead>
              <p>پس از تأیید، اعتبار خرید و دکمه شروع خرید تایر فعال می‌شود.</p>
              <Steps><i className="on" /><i className="on" /><i /></Steps>
            </StatusCard>
            {process.env.NODE_ENV === "development" && <CtaBtn type="button" disabled={loading} onClick={onDemoApprove}>{loading ? "در حال تأیید..." : "نمایش نتیجه تأیید (دمو)"}</CtaBtn>}
          </>
        ) : step === "terms" ? (
          <>
            <p>شرایط پرداخت، مبلغ کارمزد و زمان‌بندی اقساط پیش از ثبت سفارش و در پیش‌فاکتور نمایش داده می‌شود.</p>
            <ContractLink onClick={() => setShowTerms(!showTerms)}><span>مشاهده قرارداد و شرایط خرید قسطی</span><b>{showTerms ? "↓" : "←"}</b></ContractLink>
            {showTerms && <ContractText>نرخ کارمزد و تعداد اقساط ممکن است بر اساس شرایط فروش تغییر کند؛ مبلغ نهایی و زمان‌بندی پرداخت پیش از ثبت سفارش در پیش‌فاکتور به‌صورت شفاف نمایش داده می‌شود.</ContractText>}
            <CheckRow><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>قرارداد و شرایط خرید قسطی را مطالعه کردم و می‌پذیرم.</span></CheckRow>
            <CtaBtn disabled={!agree || loading} style={{ opacity: agree ? 1 : 0.4 }} onClick={proceed}>{loading ? "در حال ثبت..." : "تأیید شرایط و ادامه"}</CtaBtn>
          </>
        ) : fleets.length === 0 ? (
          <>
            <EmptyFleet><b>ناوگانی برای انتخاب نداریم</b>برای محاسبه و تطبیق تایر، ابتدا یک ناوگان به حساب خودت اضافه کن.</EmptyFleet>
            <CtaBtn onClick={onRegisterFleet}>رفتن به ثبت ناوگان</CtaBtn>
          </>
        ) : (
          <>
            <p>این درخواست اعتبار برای کدام ناوگان ثبت شود؟</p>
            {fleets.map((item: any) => (
              <FleetChoice key={fleetId(item)} $on={fleet === fleetId(item)} onClick={() => setFleet(fleetId(item))}>
                <span className="art">🚛</span>
                <span><b>{fleetName(item)}</b><small>{fleetPlate(item)}</small></span>
                <span className="dot" />
              </FleetChoice>
            ))}
            <CtaBtn disabled={!fleet || loading} style={{ opacity: fleet ? 1 : 0.4 }} onClick={() => onSubmit(fleet)}>{loading ? "در حال ثبت..." : "ادامه با ناوگان انتخاب‌شده"}</CtaBtn>
          </>
        )}
      </SheetBody>
    </Sheet>
  );
}
