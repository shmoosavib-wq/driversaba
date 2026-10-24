import { TireInstallment, TireOrder, TireShop } from "@/services/tire-store-api";
import { Pill } from "./style2";
import { Empty } from "./style3";
import { HCard, InvFoot, InvHead, InvLine, Invoice, InvMeta, InvSum, InvTable } from "./style5";
import { jalaliDate, jalaliDateTime, toman } from "./helpers";

const STATUS: Record<TireOrder["status"], { text: string; ok?: boolean }> = {
  AwaitingFirstPayment: { text: "در انتظار پرداخت" },
  AwaitingSellerApproval: { text: "در انتظار تایید فروشنده" },
  Approved: { text: "در انتظار تحویل", ok: true },
  AwaitingDriverConfirm: { text: "منتظر تایید دریافت", ok: true },
  Delivered: { text: "تحویل شده", ok: true },
  Rejected: { text: "رد شده" },
};

type Props = { orders: TireOrder[]; installments: TireInstallment[]; shops: TireShop[]; onOpen: (order: TireOrder) => void };

export function History({ orders, installments, shops, onOpen }: Props) {
  const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!sorted.length) return <Empty><div>🧾</div>هنوز خریدی ثبت نکرده‌ای</Empty>;
  return (
    <>
      <div style={{ height: 12 }} />
      {sorted.map((order) => {
        const payments = installments.filter((installment) => installment.orderId === order.id).sort((a, b) => a.number - b.number);
        const paidCount = payments.filter((payment) => payment.status.toLowerCase() === "paid").length;
        const fullyPaid = payments.length > 0 && paidCount === payments.length;
        const status = fullyPaid ? { text: "تسویه کامل", ok: true } : STATUS[order.status];
        const shopName = shops.find((shop) => shop.id === order.shopId)?.name || "فروشگاه طرف قرارداد";
        return (
          <HCard key={order.id} onClick={() => onOpen(order)} style={{ padding: 0, gap: 0, overflow: "hidden" }} aria-label={`فاکتور خرید ${order.proformaNumber}`}>
            <Invoice style={{ margin: 0, border: 0, borderRadius: 0, boxShadow: "none" }}>
              <InvHead>
                <div><b>فاکتور خرید</b><small>{shopName}<br />تاریخ سفارش: {jalaliDate(order.createdAt)}</small></div>
                <div style={{ display: "grid", justifyItems: "end", gap: 8 }}><span className="no">{order.proformaNumber}</span><Pill $ok={status.ok}>{status.text}</Pill></div>
              </InvHead>
              <InvMeta>
                <div><small>روش پرداخت</small><b>{order.paymentMode === "Cash" ? "نقدی" : `اقساطی · ${order.installmentCount || payments.length || 4} قسط`}</b></div>
                <div><small>زمان ثبت سفارش</small><b>{jalaliDateTime(order.createdAt)}</b></div>
                {order.fleetPlate && <div><small>پلاک ناوگان</small><b>{order.fleetPlate}</b></div>}
              </InvMeta>
              <InvTable>
                {order.items.map((item) => (
                  <InvLine key={item.productId}>
                    <b>{item.title}</b><em>{toman(item.unitPrice * item.quantity)} تومان</em>
                    <small>{item.size} · {item.quantity.toLocaleString("fa-IR")} جفت × {toman(item.unitPrice)} تومان</small>
                  </InvLine>
                ))}
              </InvTable>
              <InvSum><span>جمع کالا</span><span>{toman(order.subtotal)} تومان</span></InvSum>
              {order.downPayment ? <InvSum><span>مازاد اعتبار · در پرداخت اول</span><span>{toman(order.downPayment)} تومان</span></InvSum> : null}
              {order.fee > 0 && <InvSum><span>کارمزد اقساط</span><span>{toman(order.fee)} تومان</span></InvSum>}
              <InvSum $big><span>مبلغ کل فاکتور</span><span>{toman(order.total)} تومان</span></InvSum>
              {payments.length > 0 && <>
                <div style={{ padding: "12px 14px 4px", color: "#223038", fontSize: 12, fontWeight: 900 }}>وضعیت پرداخت‌ها</div>
                <InvTable>
                  {payments.map((payment) => {
                    const isPaid = payment.status.toLowerCase() === "paid";
                    return <InvLine key={payment.id}>
                      <b>{order.paymentMode === "Cash" ? "پرداخت خرید" : `قسط ${payment.number.toLocaleString("fa-IR")}`} · {isPaid ? "پرداخت‌شده" : "پرداخت‌نشده"}</b>
                      <em>{toman(payment.amount)} تومان</em>
                      <small>{isPaid ? `تاریخ پرداخت: ${payment.paidAt ? jalaliDateTime(payment.paidAt) : "در انتظار ثبت زمان پرداخت"}` : `سررسید: ${jalaliDate(payment.dueDate)}`}</small>
                    </InvLine>;
                  })}
                </InvTable>
              </>}
              <InvFoot>برای مشاهده‌ی وضعیت سفارش و جزئیات بیشتر، فاکتور را باز کن.</InvFoot>
            </Invoice>
          </HCard>
        );
      })}
    </>
  );
}
