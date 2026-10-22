import { useState } from "react";
import { Quote, TireProduct } from "@/services/tire-store-api";
import { Check, Cta, Row, Section, Split } from "./style2";
import { jalaliDate, toman } from "./helpers";

type ConfirmProps = {
  lines: { product: TireProduct; qty: number }[];
  quote?: Quote;
  loading: boolean;
  onConfirm: () => void;
};

export function Confirm({ lines, quote, loading, onConfirm }: ConfirmProps) {
  const [agree, setAgree] = useState(false);
  if (!quote) return <Section><small>در حال محاسبه...</small></Section>;
  const share = Math.round((quote.subtotal / quote.total) * 100);
  const today = new Date();
  const schedule = Array.from({ length: quote.installments }, (_, i) => {
    const date = new Date(today);
    date.setMonth(date.getMonth() + i);
    return { n: i + 1, date, amount: i === 0 ? quote.firstInstallment : i === quote.installments - 1 ? quote.lastInstallment : quote.nextInstallment };
  });
  return (
    <>
      <Section>
        <h3>اقلام سفارش</h3>
        {lines.map(({ product, qty }) => (
          <Row key={product.id}><span>{product.brand} {product.model} × {qty.toLocaleString("fa-IR")}</span><b>{toman(product.price * qty)}</b></Row>
        ))}
      </Section>
      <Section>
        <h3>خلاصه پرداخت</h3>
        <Row><small>مبلغ خرید</small><b>{toman(quote.subtotal)} تومان</b></Row>
        {quote.paymentMode === "Cash" ? <Row><small>کارمزد خرید نقدی</small><b>بدون کارمزد</b></Row> : <Row><small>کارمزد اقساط</small><b>{toman(quote.fee)} تومان</b></Row>}
        <Row><small>مجموع</small><b>{toman(quote.total)} تومان</b></Row>
        <Split $a={share}><i /></Split>
        {quote.paymentMode !== "Cash" && <Row><small>اصل مبلغ {share.toLocaleString("fa-IR")}٪</small><small>کارمزد</small></Row>}
      </Section>
      <Section>
        <h3>{quote.paymentMode === "Cash" ? "پرداخت نقدی" : "برنامه‌ی " + quote.installments.toLocaleString("fa-IR") + " قسط"}</h3>
        {schedule.map((s) => (
          <Row key={s.n}>
            <span>{quote.paymentMode === "Cash" ? "پرداخت کامل" : "قسط " + s.n.toLocaleString("fa-IR")} · <small>{s.n === 1 ? "پس از تأیید پیش‌فاکتور فروشنده" : jalaliDate(s.date)}</small></span>
            <b>{toman(s.amount)} تومان</b>
          </Row>
        ))}
      </Section>
      <Check><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />{quote.paymentMode === "Cash" ? "مبلغ کامل پس از تأیید پیش‌فاکتور توسط فروشنده پرداخت می‌شود. بازه‌ی تحویل را بعد از پرداخت مشخص می‌کنم." : "شرایط پرداخت " + quote.installments.toLocaleString("fa-IR") + " قسط و کارمزد اقساط را می‌پذیرم. پرداخت قسط اول پس از تأیید پیش‌فاکتور انجام می‌شود و بازه‌ی تحویل را بعد از آن مشخص می‌کنم."}</Check>
      <Cta disabled={!agree || loading} onClick={onConfirm}>{loading ? "در حال ارسال..." : "ارسال پیش‌فاکتور برای فروشنده"}</Cta>
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
