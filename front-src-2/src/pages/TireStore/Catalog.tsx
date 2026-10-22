import { useCallback, useMemo, useRef, useState } from "react";
import { PaymentMode, TireProduct, TireShop } from "@/services/tire-store-api";
import { Shop as ShopCard } from "./style";
import { Section } from "./style2";
import {
  Bar, BarBtn, BarInfo, CalcRow, CalcTotal, Chip, DBrand, DCard, DName, Desc, Empty, Media, PBottom, PInst,
  PPrice, PSave, PSize, Qty, SecTitle, SpecRow, Tag,
} from "./style3";
import { fa, installmentAmount, toman } from "./helpers";
import { getDiscount } from "./discount";
import ProductCard from "./components/ProductCard";
import DealRibbon from "./components/DealRibbon";
import { EMPTY_FILTERS, FilterPage, filterCount, TireFilters } from "./Filter";
import { FBar, FBtn, FTag } from "./style5";

const TireArt = ({ p, big }: { p: TireProduct; big?: boolean }) => (
  <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={big ? undefined : { width: "100%", height: "100%" }} preserveAspectRatio={big ? undefined : "xMidYMid slice"}>
    <defs>
      <linearGradient id={`g${p.id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2c3a42" /><stop offset="100%" stopColor="#10181c" /></linearGradient>
      <radialGradient id={`r${p.id}`} cx="50%" cy="50%" r="50%"><stop offset="55%" stopColor="#1b2429" /><stop offset="100%" stopColor="#0b0f12" /></radialGradient>
    </defs>
    <rect width="320" height="200" fill={`url(#g${p.id})`} />
    <ellipse cx="160" cy="176" rx="96" ry="8" fill="#000" opacity=".35" />
    <circle cx="160" cy="100" r="76" fill={`url(#r${p.id})`} />
    <circle cx="160" cy="100" r="72" fill="none" stroke="#3a474f" strokeWidth="9" strokeDasharray="7 5" />
    <circle cx="160" cy="100" r="60" fill="none" stroke="#273239" strokeWidth="3" />
    <circle cx="160" cy="100" r="46" fill="none" stroke="#2e3a41" strokeWidth="2" />
    <circle cx="160" cy="100" r="26" fill="#1a2227" stroke="#46545c" strokeWidth="2" />
    <circle cx="160" cy="100" r="6" fill="#46545c" />
    {big && <text x="16" y="190" fill="#fff" fontSize="13" fontWeight="800">{p.brand}</text>}
    {big && <text x="304" y="24" textAnchor="end" fill="#fff" opacity=".85" fontSize="10" fontWeight="700">{p.size}</text>}
  </svg>
);

const SwipeGallery = ({ p, variant }: { p: TireProduct; variant: "card" | "detail" }) => {
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const gesture = useRef<{ x: number; y: number; width: number; delta: number; axis?: "x" | "y" } | null>(null);
  const swiped = useRef(false);
  const images = p.images?.length ? p.images : [];
  const total = Math.max(1, images.length);
  const go = (index: number) => setActive(Math.max(0, Math.min(total - 1, index)));
  const finish = () => {
    const current = gesture.current;
    if (current?.axis === "x" && Math.abs(current.delta) > Math.min(45, current.width * 0.15)) go(active + (current.delta < 0 ? 1 : -1));
    gesture.current = null;
    setOffset(0);
  };
  return (
    <div className={`tire-swipe-gallery tire-swipe-gallery--${variant}`} role="region" aria-label={`تصاویر ${p.model}`} tabIndex={total > 1 ? 0 : undefined}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          go(active + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
      onPointerDown={(event) => {
        swiped.current = false;
        if (total < 2 || event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
        gesture.current = { x: event.clientX, y: event.clientY, width: event.currentTarget.clientWidth || 1, delta: 0 };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const current = gesture.current;
        if (!current) return;
        const dx = event.clientX - current.x;
        const dy = event.clientY - current.y;
        if (!current.axis) {
          if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { current.axis = "x"; event.currentTarget.setPointerCapture(event.pointerId); }
          else if (Math.abs(dy) > 6) current.axis = "y";
        }
        if (current.axis !== "x") return;
        swiped.current = true;
        current.delta = dx;
        const edge = (active === 0 && dx > 0) || (active === total - 1 && dx < 0);
        setOffset(edge ? dx / 3 : dx);
      }}
      onPointerUp={finish}
      onPointerCancel={() => { gesture.current = null; setOffset(0); }}
      onClickCapture={(event) => { if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; } }}>
      <div className="tire-swipe-track" style={{ transform: `translateX(calc(${-active * 100}% + ${offset}px))`, transition: offset ? "none" : "transform .28s ease" }}>
        {images.length ? images.map((src, index) => failedImages.includes(index)
          ? <div key={index} className="tire-swipe-fallback"><TireArt p={p} /></div>
          : <img key={index} src={src} alt={`${p.model} ${fa(index + 1)}`} draggable={false} onError={() => setFailedImages((current) => [...current, index])} />) : <div className="tire-swipe-fallback"><TireArt p={p} /></div>}
      </div>
      {total > 1 && <>
        <button type="button" className="tire-swipe-arrow tire-swipe-arrow--prev" disabled={active === 0} aria-label="تصویر قبلی" onClick={(event) => { event.stopPropagation(); go(active - 1); }}>‹</button>
        <button type="button" className="tire-swipe-arrow tire-swipe-arrow--next" disabled={active === total - 1} aria-label="تصویر بعدی" onClick={(event) => { event.stopPropagation(); go(active + 1); }}>›</button>
      </>}
      {total > 1 && <span className="tire-swipe-dots">{images.map((_, index) => <button type="button" key={index} aria-label={`تصویر ${fa(index + 1)}`} aria-current={index === active ? "true" : undefined} className={index === active ? "on" : ""} onClick={(event) => { event.stopPropagation(); go(index); }} />)}</span>}
    </div>
  );
};

export function Shops({ shops, onPick }: { shops: TireShop[]; onPick: (id: number) => void }) {
  return (
    <>
      <SecTitle>فروشگاه‌های طرف قرارداد</SecTitle>
      <div style={{ padding: "0 16px" }}>
        {shops.map((s) => (
          <ShopCard key={s.id} $active={false} style={{ minWidth: 0, width: "100%", marginBottom: 10 }} onClick={() => onPick(s.id)}>
            <b>{s.name}</b><small>{s.address}</small><em>طرف قرارداد صبابار · {fa(s.productCount)} قلم کالا</em>
          </ShopCard>
        ))}
      </div>
      <Section style={{ background: "none", border: 0, boxShadow: "none" }}><small style={{ color: "#7a8a94", fontSize: 11 }}>موجودی و قیمت هر فروشگاه می‌تواند متفاوت باشد.</small></Section>
    </>
  );
}

type Props = {
  commerceEnabled: boolean;
  shop?: TireShop;
  products: TireProduct[];
  cart: Record<number, number>;
  remaining?: number;
  total: number;
  paymentMode: PaymentMode;
  installmentCount: number;
  feeRate?: number;
  onPaymentPlan: (mode: PaymentMode, count: number) => void;
  fleets: { id: number; name: string; plate: string }[];
  selectedFleetId: number;
  onFleetChange: (id: number) => void;
  onQty: (p: TireProduct, delta: number) => void;
  onOpen: (p: TireProduct) => void;
  onCheckout: () => void;
};

export function Catalog({ commerceEnabled, shop, products, cart, remaining, total, paymentMode, installmentCount, feeRate = 0, onPaymentPlan, fleets, selectedFleetId, onFleetChange, onQty, onOpen, onCheckout }: Props) {
  const [filters, setFilters] = useState<TireFilters>(EMPTY_FILTERS);
  const [open, setOpen] = useState(false);
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), [products]);
  const sizes = useMemo(() => [...new Set(products.map((p) => p.size).filter(Boolean))].sort(), [products]);
  const matches = useCallback((f: TireFilters) => products.filter((p) => (!f.brands.length || f.brands.includes(p.brand)) && (!f.sizes.length || f.sizes.includes(p.size))), [products]);
  const filtered = useMemo(() => matches(filters), [matches, filters]);
  const active = filterCount(filters);  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
  const over = paymentMode === "Installments" && remaining !== undefined && subtotal > remaining;
  return (
    <>
      <div style={{ height: 12 }} />
      {remaining !== undefined && <Chip>💳 <span>اعتبار باقی‌مانده تو:</span><b>{toman(remaining)} تومان</b></Chip>}
      {shop && <SecTitle style={{ marginTop: 2 }}>{shop.name}</SecTitle>}
      <FBar>
        <FBtn $on={active > 0} onClick={() => setOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
          فیلترها{active > 0 && <b>{fa(active)}</b>}
        </FBtn>
        {filters.brands.map((b) => <FTag key={"b" + b} onClick={() => setFilters({ ...filters, brands: filters.brands.filter((v) => v !== b) })}>{b} ✕</FTag>)}
        {filters.sizes.map((s) => <FTag key={"s" + s} style={{ direction: "ltr" }} onClick={() => setFilters({ ...filters, sizes: filters.sizes.filter((v) => v !== s) })}>{s} ✕</FTag>)}
      </FBar>
      {open && <FilterPage value={filters} brands={brands} sizes={sizes} resultCount={(f) => matches(f).length} onApply={(f) => { setFilters(f); setOpen(false); }} onClose={() => setOpen(false)} />}
          {filtered.length === 0 && <Empty><div>🔍</div>محصولی با این فیلترها پیدا نشد{active > 0 && <><br /><FTag style={{ margin: "10px auto 0" }} onClick={() => setFilters(EMPTY_FILTERS)}>حذف فیلترها</FTag></>}</Empty>}
      {filtered.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          paymentMode={paymentMode}
          installmentCount={installmentCount}
          feeRate={feeRate}
          commerceEnabled={commerceEnabled}
          gallery={<SwipeGallery p={product} variant="card" />}
          onOpen={onOpen}
        />
      ))}
      {commerceEnabled && <Bar>
        <BarInfo $warn={over}>
          {count ? (over ? "مبلغ کالاها از اعتبار باقی‌مانده بیشتر است" : `${fa(count)} جفت در سبد`) : "برای ادامه، تعداد لاستیک را مشخص کن"}
          {count > 0 && <b>{toman(total)} تومان</b>}
        </BarInfo>
        <BarBtn disabled={!count || over} onClick={onCheckout}>ادامه خرید</BarBtn>
      </Bar>}
    </>
  );
}

type DetailProps = { commerceEnabled: boolean; product: TireProduct; qty: number; paymentMode: PaymentMode; installmentCount: number; feeRate?: number; onPaymentPlan: (mode: PaymentMode, count: number) => void; fleets: { id: number; name: string; plate: string }[]; selectedFleetId: number; onFleetChange: (id: number) => void; onQty: (p: TireProduct, delta: number) => void; onCheckout: () => void };

export function ProductDetail({ commerceEnabled, product: p, qty, paymentMode, installmentCount, feeRate = 0, onPaymentPlan, fleets, selectedFleetId, onFleetChange, onQty, onCheckout }: DetailProps) {
  const [calc, setCalc] = useState(1);
  const n = qty || calc;
  const deal = getDiscount(p.price, p.compareAtPrice);
  const total = Math.round(p.price * n * (paymentMode === "Cash" ? 1 : 1 + feeRate));
  const first = Math.ceil(total / (paymentMode === "Cash" ? 1 : installmentCount));
  const next = Math.round((total - first) / Math.max(1, installmentCount - 1));
  const rows: [string, string | number | undefined][] = [
    ["برند", p.brand], ["مدل", p.model], ["سایز", p.size],
    ["پهنا (mm)", p.width ? fa(p.width) : ""], ["فاق (%)", p.profile ? fa(p.profile) : ""],
    ["قطر رینگ", p.rim], ["پترن / طرح آج", p.pattern], ["محور مصرف", p.axlePosition], ["شاخص وزن و سرعت", p.loadIndex],
    ["سال ساخت", p.year ? p.year.toLocaleString("fa-IR", { useGrouping: false }) : ""], ["کشور تولیدکننده", p.country],
  ];
  return (
    <>
      <div style={{ height: 12 }} />
      <Media className={deal.active ? "is-deal" : undefined}>
        <SwipeGallery p={p} variant="detail" />
        <DealRibbon deal={deal} />
      </Media>
      <DCard>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>
          <DBrand>{p.brand}</DBrand>
          <Tag $warn={p.stock <= 5}>{p.stock <= 0 ? "ناموجود" : p.stock <= 5 ? `تنها ${fa(p.stock)} جفت در انبار` : `موجود · ${fa(p.stock)} جفت`}</Tag>
        </div>
        <DName>{p.model}</DName>
        <PSize>RING: {p.size}</PSize>
        <PBottom>
          <div>
            <PPrice $sale={deal.active}>
              {deal.active ? <span className="was">{toman(deal.compareAt)} تومان</span> : null}
              {toman(p.price)} <small>تومان / جفت</small>
            </PPrice>
            {deal.active ? <PSave>صرفه‌جویی <b>{toman(deal.savings)} تومان</b></PSave> : null}
          </div>
          <PInst>{commerceEnabled ? paymentMode === "Cash" ? "پرداخت نقدی · بدون کارمزد" : `${fa(installmentCount)} قسط ماهانه · هر قسط حدود ${toman(installmentAmount(p.price, installmentCount, feeRate))} تومان` : "ثبت سفارش در این مرحله غیرفعال است"}</PInst>
        </PBottom>
      </DCard>
      <SecTitle>مشخصات فنی</SecTitle>
      <DCard style={{ paddingTop: 4, paddingBottom: 4 }}>
        {rows.map(([k, v]) => <SpecRow key={k}><span>{k}</span><b>{v || "ثبت نشده"}</b></SpecRow>)}
      </DCard>
      <SecTitle>توضیحات محصول</SecTitle><DCard><Desc>{p.description || "توضیحی برای این محصول ثبت نشده است."}</Desc></DCard>
      {commerceEnabled ? <>
        <SecTitle>{paymentMode === "Cash" ? "خلاصه مبلغ خرید" : "محاسبه اقساط"}</SecTitle>
        <DCard>
          <CalcRow>
            <span>تعداد (جفت)</span>
            <Qty>
              <button onClick={() => (qty ? onQty(p, -1) : setCalc(Math.max(1, calc - 1)))}>−</button>
              <b>{fa(n)}</b>
              <button onClick={() => (qty ? onQty(p, 1) : setCalc(Math.min(p.stock, calc + 1)))} disabled={n >= p.stock}>+</button>
            </Qty>
          </CalcRow>
          {paymentMode === "Cash" ? <CalcRow><span>قابل پرداخت پس از تأیید فروشنده</span><b>{toman(total)} تومان</b></CalcRow> : <><CalcRow><span>قسط اول پس از تأیید فروشنده</span><b>{toman(first)} تومان</b></CalcRow><CalcRow><span>{fa(installmentCount - 1)} قسط بعدی · ماهانه</span><b>هر قسط حدود {toman(next)} تومان</b></CalcRow></>}
          <CalcTotal><span>{paymentMode === "Cash" ? "مبلغ نهایی خرید نقدی" : "مجموع با کارمزد اقساط"}</span><b>{toman(total)} تومان</b></CalcTotal>
        </DCard>
        <Bar>
          <BarInfo>{qty ? `در سبد خرید فعلی: ${fa(qty)} جفت` : "در سبد نیست"}</BarInfo>
          {qty ? (
            <BarBtn onClick={onCheckout}>ادامه خرید</BarBtn>
          ) : (
            <BarBtn disabled={p.stock < 1} onClick={() => onQty(p, calc)}>{p.stock < 1 ? "ناموجود" : "افزودن به سبد خرید"}</BarBtn>
          )}
        </Bar>
      </> : <DCard role="status">قیمت‌ها و مشخصات محصول برای مشاهده در دسترس‌اند؛ ثبت سفارش در این مرحله فعال نیست.</DCard>}
    </>
  );
}
