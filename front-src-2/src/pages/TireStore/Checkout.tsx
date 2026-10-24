import { useState } from "react";
import { PaymentMode, Quote, TireInstallmentPlan, TireProduct } from "@/services/tire-store-api";
import { Check, Cta, Row, Section, Split } from "./style2";
import { jalaliDate, toman } from "./helpers";
import { PlanBox, PlanModeButton, PlanModes } from "./style3";

type ConfirmProps = {
  lines: { product: TireProduct; qty: number }[];
  quote?: Quote;
  quoteLoading: boolean;
  quoteError: boolean;
  paymentMode: PaymentMode;
  canInstallments: boolean;
  installmentPlans: TireInstallmentPlan[];
  installmentCount: number;
  onInstallmentCount: (count: 2 | 4) => void;
  installmentUnavailableReason?: string;
  loading: boolean;
  onPaymentMode: (mode: PaymentMode) => void;
  onRetryQuote: () => void;
  onConfirm: () => void;
};

export function Confirm({ lines, quote, quoteLoading, quoteError, paymentMode, canInstallments, installmentPlans, installmentCount, onInstallmentCount, installmentUnavailableReason, loading, onPaymentMode, onRetryQuote, onConfirm }: ConfirmProps) {
  const [agree, setAgree] = useState(false);
  if (quoteLoading || !quote || quoteError) return (
    <>
      <Section>
        <h3>روش پرداخت</h3>
        <PlanBox style={{ margin: 0 }}><PlanModes>
          <PlanModeButton type="button" className={paymentMode === "Cash" ? "on" : ""} aria-pressed={paymentMode === "Cash"} onClick={() => onPaymentMode("Cash")}>نقدی · بدون کارمزد</PlanModeButton>
          <PlanModeButton type="button" className={paymentMode === "Installments" ? "on" : ""} aria-pressed={paymentMode === "Installments"} disabled={installmentPlans.length === 0} onClick={() => onPaymentMode("Installments")}>اقساطی</PlanModeButton>
        </PlanModes>{installmentUnavailableReason && <small role="status">{installmentUnavailableReason}</small>}</PlanBox>
        {paymentMode === "Installments" && installmentPlans.length > 1 && <PlanModes aria-label="تعداد اقساط">{installmentPlans.map(plan => <PlanModeButton key={plan.installmentCount} type="button" className={installmentCount === plan.installmentCount ? "on" : ""} aria-pressed={installmentCount === plan.installmentCount} onClick={() => onInstallmentCount(plan.installmentCount)}>{plan.installmentCount} قسط · کارمزد {(plan.feeRate * 100).toLocaleString("fa-IR")}٪</PlanModeButton>)}</PlanModes>}
        {quoteLoading && <small role="status">در حال محاسبه مبلغ نهایی...</small>}
        {quoteError && <><small role="alert">محاسبه مبلغ ناموفق بود.</small><Cta onClick={onRetryQuote}>تلاش دوباره</Cta></>}
      </Section>
    </>
  );
  const financedScheduleTotal = quote.total - quote.downPayment;
  const share = financedScheduleTotal > 0 ? Math.round((quote.financedPrincipal / financedScheduleTotal) * 100) : 0;
  const today = new Date();
  const schedule = Array.from({ length: quote.installments }, (_, i) => {
    const date = new Date(today);
    date.setMonth(date.getMonth() + i);
    return { n: i + 1, date, amount: i === 0 ? quote.firstInstallment : i === quote.installments - 1 ? quote.lastInstallment : quote.nextInstallment };
  });
  return (
    <>
      <Section>
        <h3>روش پرداخت</h3>
        <PlanBox style={{ margin: 0 }}><PlanModes>
          <PlanModeButton type="button" className={paymentMode === "Cash" ? "on" : ""} aria-pressed={paymentMode === "Cash"} onClick={() => onPaymentMode("Cash")}>نقدی · بدون کارمزد</PlanModeButton>
          <PlanModeButton type="button" className={paymentMode === "Installments" ? "on" : ""} aria-pressed={paymentMode === "Installments"} disabled={installmentPlans.length === 0} onClick={() => onPaymentMode("Installments")}>اقساطی</PlanModeButton>
        </PlanModes>{installmentUnavailableReason && <small role="status">{installmentUnavailableReason}</small>}</PlanBox>
        {paymentMode === "Installments" && installmentPlans.length > 1 && <PlanModes aria-label="تعداد اقساط">{installmentPlans.map(plan => <PlanModeButton key={plan.installmentCount} type="button" className={installmentCount === plan.installmentCount ? "on" : ""} aria-pressed={installmentCount === plan.installmentCount} onClick={() => onInstallmentCount(plan.installmentCount)}>{plan.installmentCount} قسط · کارمزد {(plan.feeRate * 100).toLocaleString("fa-IR")}٪</PlanModeButton>)}</PlanModes>}
        {paymentMode === "Installments" && !canInstallments && installmentPlans.length > 0 && <small role="status">شرایط اقساط قابل مشاهده است؛ برای ثبت سفارش، اعتبار تأییدشده و کافی لازم است.</small>}
      </Section>
      <Section>
        <h3>اقلام سفارش</h3>
        {lines.map(({ product, qty }) => (
          <Row key={product.id}><span>{product.brand} {product.model} × {qty.toLocaleString("fa-IR")}</span><b>{toman(product.price * qty)}</b></Row>
        ))}
      </Section>
      <Section>
        <h3>خلاصه پرداخت</h3>
        <Row><small>مبلغ خرید</small><b>{toman(quote.subtotal)} تومان</b></Row>
        {quote.downPayment > 0 && <Row><small>مازاد اعتبار · در پرداخت اول</small><b>{toman(quote.downPayment)} تومان</b></Row>}
        {quote.paymentMode === "Cash" ? <Row><small>کارمزد خرید نقدی</small><b>بدون کارمزد</b></Row> : <Row><small>کارمزد اقساط</small><b>{toman(quote.fee)} تومان</b></Row>}
        <Row><small>مجموع</small><b>{toman(quote.total)} تومان</b></Row>
        <Split $a={share}><i /></Split>
        {quote.paymentMode !== "Cash" && <Row><small>اصل مبلغ {share.toLocaleString("fa-IR")}٪</small><small>کارمزد</small></Row>}
      </Section>
      <Section>
        <h3>{quote.paymentMode === "Cash" ? "پرداخت نقدی" : "برنامه‌ی " + quote.installments.toLocaleString("fa-IR") + " قسط"}</h3>
        {schedule.map((s) => (
          <Row key={s.n}>
            <span>{quote.paymentMode === "Cash" ? "پرداخت کامل" : "قسط " + s.n.toLocaleString("fa-IR") + (s.n === 1 && quote.downPayment > 0 ? " · شامل مازاد اعتبار" : "")} · <small>{s.n === 1 ? "پس از تأیید پیش‌فاکتور فروشنده" : jalaliDate(s.date)}</small></span>
            <b>{toman(s.amount)} تومان</b>
          </Row>
        ))}
      </Section>
      <Check><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />{quote.paymentMode === "Cash" ? "مبلغ کامل پس از تأیید پیش‌فاکتور توسط فروشنده پرداخت می‌شود. بازه‌ی تحویل را بعد از پرداخت مشخص می‌کنم." : "شرایط پرداخت " + quote.installments.toLocaleString("fa-IR") + " قسط و کارمزد اقساط را می‌پذیرم. " + (quote.downPayment > 0 ? "مازاد بر اعتبار به مبلغ " + toman(quote.downPayment) + " تومان در پرداخت اول منظور شده است. " : "") + "پرداخت قسط اول پس از تأیید پیش‌فاکتور انجام می‌شود و بازه‌ی تحویل را بعد از آن مشخص می‌کنم."}</Check>
      <Cta disabled={!agree || loading || quoteLoading} onClick={onConfirm}>{loading ? "در حال ارسال..." : "ارسال پیش‌فاکتور برای فروشنده"}</Cta>
    </>
  );
}

type GatewayProps = { amount: number; loading: boolean; onPay: () => void };

export function Gateway({ amount, loading, onPay }: GatewayProps) {
  return (
    <>
      <Section>
        <h3>پرداخت از طریق تومن</h3>
        <Row><small>مبلغ قابل پرداخت</small><b>{toman(amount)} تومان</b></Row>
        <small>پس از انتقال به درگاه، نتیجه‌ی پرداخت به‌صورت امن بررسی و ثبت می‌شود.</small>
      </Section>
      <Cta disabled={loading} onClick={onPay}>{loading ? "در حال اتصال به درگاه..." : "ورود به درگاه پرداخت"}</Cta>
    </>
  );
}
