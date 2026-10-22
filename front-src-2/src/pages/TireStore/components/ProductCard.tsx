import type { ReactNode } from "react";
import { PaymentMode, TireProduct } from "@/services/tire-store-api";
import { getDiscount } from "../discount";
import { fa, installmentAmount, toman } from "../helpers";
import {
  BrandBar,
  BtnView,
  PBottom,
  PCard,
  PIn,
  PInfo,
  PInst,
  PMeta,
  PName,
  PPrice,
  PSave,
  PSize,
  PTop,
  Tag,
  Thumb,
} from "../style3";
import DealRibbon from "./DealRibbon";

type ProductCardProps = {
  product: TireProduct;
  paymentMode: PaymentMode;
  installmentCount: number;
  feeRate: number;
  commerceEnabled: boolean;
  gallery: ReactNode;
  onOpen: (product: TireProduct) => void;
};

export default function ProductCard({
  product,
  paymentMode,
  installmentCount,
  feeRate,
  commerceEnabled,
  gallery,
  onOpen,
}: ProductCardProps) {
  const deal = getDiscount(product.price, product.compareAtPrice);

  return (
    <PCard $deal={deal.active}>
      <BrandBar>
        <span className="brand-mark">{product.brand}</span>
        {product.year ? (
          <small>
            ساخت {product.year.toLocaleString("fa-IR", { useGrouping: false })}
          </small>
        ) : null}
      </BrandBar>
      <PIn>
        <PTop>
          <Thumb
            className={deal.active ? "is-deal" : undefined}
            onClick={() => onOpen(product)}
          >
            {gallery}
            <DealRibbon deal={deal} />
          </Thumb>
          <PInfo>
            <PName onClick={() => onOpen(product)}>{product.model}</PName>
            <PSize>RING: {product.size}</PSize>
            <PMeta>
              {product.pattern ? <Tag>{product.pattern}</Tag> : null}
              {product.axlePosition ? <Tag>{product.axlePosition}</Tag> : null}
              <Tag $warn={product.stock <= 5}>
                {product.stock <= 0
                  ? "ناموجود"
                  : product.stock <= 5
                    ? `تنها ${fa(product.stock)} جفت در انبار`
                    : `موجود · ${fa(product.stock)} جفت`}
              </Tag>
            </PMeta>
          </PInfo>
        </PTop>
        <PBottom>
          <div>
            <PPrice $sale={deal.active}>
              <small className="price-label">
                {deal.active ? "قیمت با تخفیف" : "قیمت هر جفت"}
              </small>
              {deal.active ? (
                <span className="was">{toman(deal.compareAt)}</span>
              ) : null}
              <strong>
                {toman(product.price)} <small>تومان</small>
              </strong>
            </PPrice>
            {deal.active && deal.tier !== "quiet" ? (
              <PSave>
                صرفه‌جویی <b>{toman(deal.savings)} تومان</b>
              </PSave>
            ) : null}
            <PInst>
              {commerceEnabled
                ? paymentMode === "Cash"
                  ? "پرداخت نقدی"
                  : `یا ${fa(installmentCount)} قسط · هر قسط حدود ${toman(installmentAmount(product.price, installmentCount, feeRate))} تومان`
                : "ثبت سفارش به‌زودی فعال می‌شود"}
            </PInst>
          </div>
          <BtnView onClick={() => onOpen(product)}>
            {commerceEnabled && product.stock > 0 ? "انتخاب لاستیک" : "جزئیات کالا"}
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 1 2 6l4 5" />
            </svg>
          </BtnView>
        </PBottom>
      </PIn>
    </PCard>
  );
}
