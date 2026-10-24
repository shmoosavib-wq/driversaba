import type { DiscountInfo } from "../discount";

type DealRibbonProps = {
  deal: DiscountInfo;
};

export default function DealRibbon({ deal }: DealRibbonProps) {
  if (!deal.active) return null;

  return (
    <span className={`deal-ribbon-wrap${deal.tier === "special" ? " is-special" : ""}`}>
      <i
        className="deal-ribbon-txt"
        role="img"
        aria-label={deal.label || `تخفیف ${deal.percentText}`}
      >
        {deal.shortLabel}
      </i>
    </span>
  );
}
