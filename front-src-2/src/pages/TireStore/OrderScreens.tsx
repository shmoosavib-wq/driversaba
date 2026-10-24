import { useEffect, useRef, useState, type ReactNode } from "react";
import DatePicker, { utils, type Day } from "@amir04lm26/react-modern-calendar-date-picker";
import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";

const tehranParts = (iso: string) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
};
import { toaster } from "baseui/toast";
import { TireInstallment, TireOrder } from "@/services/tire-store-api";

import { ProformaInvoice } from "./components/ProformaInvoice";
import { Primary } from "./style";
import { Code, Cta, Gauge, Pill, Row, Section } from "./style2";
import { jalaliDate, toman } from "./helpers";
import { DateField, PaymentDisclosure, Slots, SuccessMoment, Timeline } from "./style5";

const jalaali = require("jalaali-js");

const SLOTS = [8, 12, 16, 20];
const slotLabel = (h: number) => `${h.toLocaleString("fa-IR")} تا ${(h + 4).toLocaleString("fa-IR")}`;
const CompletionMark = () => (
  <i className="wheel" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="25" fill="#223038" />
      <circle cx="32" cy="32" r="18" stroke="#829197" strokeWidth="4" strokeDasharray="6 4" />
      <circle cx="32" cy="32" r="9" fill="#d9f1f4" />
      <circle cx="32" cy="32" r="3" fill="#008c9a" />
    </svg>
    <b>✓</b>
  </i>
);
const CompletionToast = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 3800);
    return () => window.clearTimeout(timer);
  }, []);
  return visible ? <SuccessMoment role="status" aria-live="polite">{children}</SuccessMoment> : null;
};
const toJalaliDay = (iso: string): Day => {
  const [year, month, day] = iso.split("-").map(Number);
  const result = jalaali.toJalaali(year, month, day);
  return { year: result.jy, month: result.jm, day: result.jd };
};
const toGregorianIso = (day: Day) => {
  const result = jalaali.toGregorian(day.year, day.month, day.day);
  return `${result.gy}-${String(result.gm).padStart(2, "0")}-${String(result.gd).padStart(2, "0")}`;
};


function DeliverySummary({ order, shopName, shopAddress }: { order: TireOrder; shopName?: string; shopAddress?: string }) {
  const delivery = order.deliveryFrom ? tehranParts(order.deliveryFrom) : null;
  return (
    <Section>
      <h3>کالا و محل دریافت</h3>
      {order.items.map((item) => (
        <Row key={item.productId}>
          <span><b>{item.title}</b><br /><small>{item.size}</small></span>
          <b>{item.quantity.toLocaleString("fa-IR")} جفت</b>
        </Row>
      ))}
      <Row><span>فروشگاه</span><b>{shopName || "فروشگاه طرف قرارداد صبابار"}</b></Row>
      <div><small>نشانی فروشگاه</small><b style={{ display: "block", marginTop: 3, fontSize: 11, lineHeight: 1.9, overflowWrap: "anywhere" }}>{shopAddress || "نشانی فروشگاه در دسترس نیست"}</b></div>
      {delivery && <Row><span>زمان دریافت</span><b>{jalaliDate(order.deliveryFrom!)} · {slotLabel(delivery.hour)}</b></Row>}
      <Row><span>شماره سفارش</span><b>{order.proformaNumber}</b></Row>
      <PaymentDisclosure>
        <summary>مشاهده‌ی مبلغ و جزئیات پرداخت</summary>
        <div className="rows">
          <Row><span>جمع کالا</span><b>{toman(order.subtotal)} تومان</b></Row>
          {order.downPayment ? <Row><span>مازاد اعتبار · در پرداخت اول</span><b>{toman(order.downPayment)} تومان</b></Row> : null}
          {order.fee > 0 && <Row><span>کارمزد اقساط</span><b>{toman(order.fee)} تومان</b></Row>}
          <Row><span>مبلغ کل خرید</span><b>{toman(order.total)} تومان</b></Row>
          <Row><span>روش پرداخت</span><b>{order.paymentMode === "Cash" ? "نقدی" : `اقساطی · ${order.installmentCount || 4} قسط`}</b></Row>
        </div>
      </PaymentDisclosure>
    </Section>
  );
}

function CompletedPurchase({ order, shopName, shopAddress, installments, onBackHome, onHistory }: { order: TireOrder; shopName?: string; shopAddress?: string; installments: TireInstallment[]; onBackHome: () => void; onHistory: () => void }) {
  const hasUnpaidInstallments = installments.some((installment) => installment.status.toLowerCase() !== "paid");
  return (
    <>
      <Section>
        <h3>تحویل سفارش تأیید شد</h3>
        <small>{hasUnpaidInstallments ? "کالا را تحویل گرفتی؛ اقساط باقی‌مانده از بخش «قسط‌های من» قابل پیگیری است." : "سفارش با موفقیت تکمیل شد. فاکتور و سوابق پرداخت هم در تاریخچه‌ی خرید در دسترس است."}</small>
      </Section>
      <CompletionToast><CompletionMark /><div><b>سفارش به مقصد رسید!</b><small>دریافت سفارش #{order.id.toLocaleString("fa-IR")} تأیید شد؛ امیدواریم تجربه‌ی خوبی از خریدت داشته باشی.</small></div></CompletionToast>
      <DeliverySummary order={order} shopName={shopName} shopAddress={shopAddress} />
      <Cta onClick={onBackHome}>بازگشت به صفحه‌ی خرید قسطی</Cta>
      <Primary style={{ margin: "0 16px 16px", width: "calc(100% - 32px)", background: "#fff", color: "#008c9a", border: "1px solid #01acbc" }} onClick={onHistory}>مشاهده‌ی تاریخچه‌ی خرید</Primary>
    </>
  );
}

export function AwaitingSeller({ order, shopName }: { order: TireOrder; shopName?: string }) {
  return (
    <>
      <Section>
        <h3>در انتظار تایید فروشنده</h3>
        <small>پیش‌فاکتور برای فروشنده ارسال شد. پس از تأیید، {order.paymentMode === "Cash" ? "مبلغ خرید نقدی" : "قسط اول"} برای پرداخت فعال می‌شود.</small>
      </Section>
      <ProformaInvoice order={order} title="پیش‌فاکتور فروش" shopName={shopName} />
      <Section>
        <small>درخواست خرید به پنل فروشگاه ارسال شده است. پس از بررسی و تأیید فروشنده، امکان پرداخت {order.paymentMode === "Cash" ? "مبلغ نقدی" : "قسط اول"} فعال می‌شود.</small>
      </Section>
    </>
  );
}

export function Rejected({ order, onBack }: { order: TireOrder; onBack: () => void }) {
  return (
    <>
      <Section><h3>پیش‌فاکتور رد شد</h3><small>پیش‌فاکتور {order.proformaNumber} توسط فروشنده تایید نشد. مبلغی از تو دریافت نشده و اعتبار رزروشده آزاد شد.</small></Section>
      <Cta onClick={onBack}>بازگشت به فروشگاه</Cta>
    </>
  );
}

export function Proforma({ order, shopName, onPay }: { order: TireOrder; shopName?: string; onPay: () => void }) {
  return (
    <>
      <Section>
        <h3>پیش‌فاکتور تایید شد ✅</h3>
        <small>فروشنده پیش‌فاکتور را تأیید کرد. برای نهایی‌شدن خرید، {order.paymentMode === "Cash" ? "مبلغ خرید را کامل پرداخت کن" : `قسط اول از ${order.installmentCount || 4} قسط را پرداخت کن`}؛ بازه‌ی تحویل را بعد از پرداخت مشخص می‌کنی.</small>
      </Section>
      <ProformaInvoice order={order} title="پیش‌فاکتور تاییدشده" shopName={shopName} />
      <Cta onClick={onPay}>پرداخت</Cta>
    </>
  );
}

type CodeProps = {
  order: TireOrder;
  shopName?: string;
  shopAddress?: string;
  saving: boolean;
  onWindow: (date: string, hour: number) => void;
  onDriverConfirm: () => void;
  onBackHome: () => void;
  onHistory: () => void;
};

export function DeliveryCode({ order, shopName, shopAddress, saving, onWindow, onDriverConfirm, onBackHome, onHistory, installments }: CodeProps & { installments: TireInstallment[] }) {
  const current = order.deliveryFrom ? tehranParts(order.deliveryFrom) : null;
  const minimumDate = utils("fa").getToday();
  const [editing, setEditing] = useState(false);
  const [day, setDay] = useState<Day | null>(() => minimumDate);
  const [hour, setHour] = useState(8);
  const windowRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setDay(current ? toJalaliDay(current.day) : utils("fa").getToday());
    setHour(current && SLOTS.includes(current.hour) ? current.hour : 8);
  }, [order.id, current?.day, current?.hour]);
  const rangeOk = !!day && (day.year > minimumDate.year || day.year === minimumDate.year && (day.month > minimumDate.month || day.month === minimumDate.month && day.day >= minimumDate.day));
  const hasWindow = !!current;
  const awaitingDriver = order.status === "AwaitingDriverConfirm";
  const fullyPaid = order.paymentMode === "Installments" && installments.length > 0 && installments.every((installment) => installment.status === "Paid");
  const copy = () => {
    navigator.clipboard?.writeText(order.deliveryCode || "").then(() => toaster.positive("کد کپی شد."), () => toaster.negative("کپی انجام نشد."));
  };
  const submitWindow = () => {
    if (!day || !rangeOk || saving) return;
    onWindow(toGregorianIso(day), hour);
    setEditing(false);
  };
  const stage = awaitingDriver ? 3 : hasWindow && !editing ? 2 : 1;
  if (order.status === "Delivered") return <CompletedPurchase order={order} shopName={shopName} shopAddress={shopAddress} installments={installments} onBackHome={onBackHome} onHistory={onHistory} />;
  return (
    <>
      <Section>
        <h3>{fullyPaid ? "تمام اقساط پرداخت شده ✅" : "🎉 پرداخت سفارش تأیید شد"}</h3>
        <small>{fullyPaid ? "برای تکمیل خرید، مراحل دریافت کالا را دنبال کن." : "خلاصه‌ی کالا و محل دریافت را بررسی کن و مراحل تحویل را ادامه بده."}</small>
        <Timeline aria-label="مراحل تحویل سفارش">
          <div className={stage >= 1 ? "complete" : ""}><i>{stage >= 1 ? "✓" : "1"}</i>پرداخت تأیید شد</div>
          <div className={stage === 1 ? "current" : stage >= 2 ? "complete" : ""} aria-current={stage === 1 ? "step" : undefined}><i>{stage >= 2 ? "✓" : "2"}</i>ثبت بازه‌ی تحویل</div>
          <div className={stage === 2 ? "current" : stage >= 3 ? "complete" : ""} aria-current={stage === 2 ? "step" : undefined}><i>{stage >= 3 ? "✓" : "3"}</i>ارائه‌ی کد و ثبت تحویل توسط فروشنده</div>
          <div className={stage === 3 ? "current" : stage >= 4 ? "complete" : ""} aria-current={stage === 3 ? "step" : undefined}><i>{stage >= 4 ? "✓" : "4"}</i>تأیید تطابق کالا و دریافت توسط تو</div>
        </Timeline>
      </Section>
      <DeliverySummary order={order} shopName={shopName} shopAddress={shopAddress} />
      {(!hasWindow || editing) && !awaitingDriver && (
        <Section ref={windowRef}>
          <h3>{editing ? "ویرایش بازه‌ی تحویل" : "بازه‌ی تحویل را مشخص کن"}</h3>
          <small>یک روز و یک بازه‌ی ۴ ساعته بین ۸ صبح تا ۱۲ شب انتخاب کن. در این بازه چک یا قرارداد آماده و از تو دریافت می‌شود.</small>
          <DateField>روز تحویل<DatePicker aria-label="روز تحویل" value={day} onChange={setDay} minimumDate={minimumDate} locale="fa" colorPrimary="#01acbc" calendarPopperPosition="bottom" inputPlaceholder="انتخاب تاریخ شمسی" inputClassName="tire-delivery-date-input" /><small>تاریخ انتخابی: {day ? jalaliDate(`${toGregorianIso(day)}T12:00:00Z`) : "—"}</small></DateField>
          <Slots>{SLOTS.map((h) => <button key={h} className={hour === h ? "on" : ""} onClick={() => setHour(h)}>{slotLabel(h)}</button>)}</Slots>
          {!rangeOk && <small style={{ color: "#c0392b" }}>تاریخ تحویل نمی‌تواند گذشته باشد.</small>}
          {editing && <Primary style={{ background: "#fff", color: "#008c9a", border: "1px solid #01acbc" }} onClick={() => setEditing(false)}>انصراف</Primary>}
        </Section>
      )}
      {hasWindow && !editing && (
        <Section>
          <h3>بازه‌ی تحویل</h3>
          <small>{jalaliDate(order.deliveryFrom!)} · {slotLabel(current!.hour)}</small>
          {!awaitingDriver && <Primary style={{ background: "#fff", color: "#008c9a", border: "1px solid #01acbc" }} onClick={() => setEditing(true)}>ویرایش بازه‌ی تحویل</Primary>}
        </Section>
      )}
      {hasWindow && !editing && !awaitingDriver && (
        <Section>
          <h3>کد تحویل</h3>
          <small>هنگام مراجعه برای دریافت تایر، این کد را به فروشنده نشان بده.</small>
          <Code>{order.deliveryCode}</Code>
          <Primary onClick={copy}>کپی کد</Primary>
          <small>فروشنده پس از بررسی کد و تطبیق محصول، تحویل را در پنل ثبت می‌کند.</small>
        </Section>
      )}
      {awaitingDriver && (
        <Section ref={confirmRef}>
          <h3>فروشنده تحویل سفارش را تایید کرد</h3>
          <small>تعداد، سایز و مدل تایر را بررسی کن؛ با زدن دکمه‌ی پایین تأیید می‌کنی کالا مطابق سفارش است و آن را تحویل گرفته‌ای.</small>
          {order.items.map((i) => (
            <Row key={i.productId}><span>{i.title}<br /><small>{i.size}</small></span><b>{i.quantity.toLocaleString("fa-IR")} جفت</b></Row>
          ))}
        </Section>
      )}
      {!awaitingDriver && (!hasWindow || editing) && (
        <Cta disabled={!rangeOk || !day || saving} onClick={submitWindow}>{saving ? "در حال ثبت..." : editing ? "ذخیره‌ی بازه‌ی تحویل" : "ثبت بازه‌ی تحویل"}</Cta>
      )}
      {awaitingDriver && <Cta disabled={saving} onClick={onDriverConfirm}>تأیید تطابق و دریافت کالا</Cta>}
    </>
  );
}
type InstallmentsProps = { installments: TireInstallment[]; limit: number; used: number; onPay: (i: TireInstallment) => void };

export function Installments({ installments, limit, used, onPay }: InstallmentsProps) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const unpaid = installments.filter((installment) => installment.status.toLowerCase() !== "paid").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return (
    <>
      <Section>
        <Gauge $pct={pct}><div><span>اعتبار مصرف‌شده<strong>{toman(used)}</strong>از {toman(limit)}</span></div></Gauge>
        <small>سقف اعتبار برای یک خرید است و با پرداخت اقساط دوباره شارژ نمی‌شود.</small>
      </Section>
      <Section>
        <h3>اقساط پرداخت‌نشده</h3>
        {unpaid.length === 0 && <small>قسط پرداخت‌نشده‌ای نداری.</small>}
        {unpaid.map((i) => (
          <Row key={i.id}>
            <span>سفارش {i.orderId.toLocaleString("fa-IR")} · قسط {i.number.toLocaleString("fa-IR")}<br /><small>{jalaliDate(i.dueDate)} · {toman(i.amount)} تومان</small></span>
            <Primary style={{ width: "auto", padding: "0 14px" }} onClick={() => onPay(i)}>پرداخت</Primary>
          </Row>
        ))}
      </Section>
    </>
  );
}
