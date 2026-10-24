import type { ReactNode } from "react";
import { TireProduct } from "@/services/tire-store-api";
import { getDiscount } from "../discount";
import { fa, installmentBreakdown, toman } from "../helpers";
import {
  BrandBar,
  BtnView,
  PCardBottom,
  PCard,
  PIn,
  PInfo,
  PMeta,
  PName,
  PPrice,
  PInst,
  PSize,
  PTop,
  Tag,
  Thumb,
} from "../style3";
import DealRibbon from "./DealRibbon";

type ProductCardProps = {
  product: TireProduct;
  canInstallments: boolean;
  installmentCount: number;
  feeRate: number;
  remaining?: number;
  commerceEnabled: boolean;
  gallery: ReactNode;
  onOpen: (product: TireProduct) => void;
};

export default function ProductCard({
  product,
  canInstallments,
  installmentCount,
  feeRate,
  remaining,
  commerceEnabled,
  gallery,
  onOpen,
}: ProductCardProps) {
  const deal = getDiscount(product.price, product.compareAtPrice);
  const plan = installmentBreakdown(product.price, installmentCount, feeRate, canInstallments ? remaining : undefined);
  const planText = plan.downPayment > 0
    ? `پرداخت اول ≈ ${toman(plan.first)} · ${fa(installmentCount - 1)} قسط ≈ ${toman(plan.next)}`
    : `${fa(installmentCount)} قسط · هر قسط ≈ ${toman(plan.first)} تومان`;

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
        <PCardBottom>
          <div>
            <PPrice $sale={deal.active}>
              {deal.active ? (
                <span className="was">{toman(deal.compareAt)}</span>
              ) : null}
              <strong>
                {toman(product.price)} <small>تومان</small>
              </strong>
            </PPrice>
            {commerceEnabled && <PInst>{canInstallments ? "" : "با اعتبار کافی · "}{planText}</PInst>}
          </div>
          <BtnView onClick={() => onOpen(product)}>
            جزئیات
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
        </PCardBottom>
      </PIn>
    </PCard>
  );
}
