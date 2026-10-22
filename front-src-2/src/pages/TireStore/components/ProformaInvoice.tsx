import type { TireOrder } from "@/services/tire-store-api";
import { jalaliDate, jalaliDateTime, toman } from "../helpers";
import { InvFoot, InvHead, InvLine, Invoice, InvMeta, InvSum, InvTable } from "../style5";

export function ProformaInvoice({ order, title, shopName, shopAddress, foot }: { order: TireOrder; title: string; shopName?: string; shopAddress?: string; foot?: string }) {
  return (
    <Invoice>
      <InvHead>
        <div><b>{title}</b><small>فروشگاه: {shopName || "فروشگاه طرف قرارداد صبابار"}<br />تاریخ صدور: {jalaliDate(order.createdAt)}</small></div>
        <span className="no">{order.proformaNumber}</span>
      </InvHead>
      <InvMeta>
        <div><small>روش خرید</small><b>{order.paymentMode === "Cash" ? "نقدی" : `اقساطی · ${order.installmentCount || 4} قسط`}</b></div>
        <div><small>زمان ثبت سفارش</small><b>{jalaliDateTime(order.createdAt)}</b></div>
        {order.fleetPlate && <div><small>ناوگان انتخاب‌شده</small><b>{order.fleetPlate}</b></div>}
        <div style={{ gridColumn: "1 / -1" }}><small>محل تحویل از فروشگاه</small><b style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{shopName || "فروشگاه طرف قرارداد صبابار"}{shopAddress ? ` · ${shopAddress}` : " · نشانی در دسترس نیست"}</b></div>
      </InvMeta>
      <InvTable>
        {order.items.map((i) => (
          <InvLine key={i.productId}>
            <b>{i.title}</b><em>{toman(i.unitPrice * i.quantity)}</em>
            <small>{i.size} · {i.quantity.toLocaleString("fa-IR")} جفت × {toman(i.unitPrice)} تومان</small>
          </InvLine>
        ))}
      </InvTable>
      <InvSum><span>جمع کالا</span><span>{toman(order.subtotal)} تومان</span></InvSum>
      {order.fee > 0 && <InvSum><span>کارمزد اقساط</span><span>{toman(order.fee)} تومان</span></InvSum>}
      <InvSum $big><span>مبلغ قابل پرداخت</span><span>{toman(order.total)} تومان</span></InvSum>
      <InvFoot>{foot || (order.paymentMode === "Cash" ? "پرداخت نقدی پس از تأیید پیش‌فاکتور فروشنده انجام می‌شود." : `پرداخت اقساطی در ${order.installmentCount || 4} مرحله انجام می‌شود؛ قسط اول پس از تأیید فروشنده قابل پرداخت است.`)}</InvFoot>
    </Invoice>
  );
}
