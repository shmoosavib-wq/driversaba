export type DiscountTier = "none" | "quiet" | "standard" | "special";

export type DiscountInfo = {
  active: boolean;
  tier: DiscountTier;
  percent: number;
  percentText: string;
  savings: number;
  compareAt: number;
  /** Full human label, e.g. "فروش ویژه ٪۳۰" — used on the detail page. */
  label: string | null;
  /** Condensed label for the narrow corner ribbon on cards, e.g. "٪۳۰". */
  shortLabel: string;
};

const MIN_VISIBLE_PERCENT = 5;
const SPECIAL_PERCENT = 30;

const NO_DISCOUNT: DiscountInfo = {
  active: false, tier: "none", percent: 0, percentText: "", savings: 0, compareAt: 0, label: null, shortLabel: "",
};

const faPercent = (value: number) => `٪${Math.round(value).toLocaleString("fa-IR")}`;

/**
 * Derives the display-only discount state from the sale price and the optional
 * reference price. A discount is active only when the reference price is
 * strictly higher than the sale price.
 */
export const getDiscount = (price: number, compareAtPrice?: number | null): DiscountInfo => {
  if (!compareAtPrice || compareAtPrice <= price || price <= 0) return NO_DISCOUNT;
  const percent = ((compareAtPrice - price) / compareAtPrice) * 100;
  const savings = compareAtPrice - price;
  if (percent < MIN_VISIBLE_PERCENT) return NO_DISCOUNT;
  const tier: DiscountTier = percent >= SPECIAL_PERCENT ? "special" : percent >= 10 ? "standard" : "quiet";
  const percentText = faPercent(percent);
  const label = tier === "special" ? `فروش ویژه ${percentText}` : `${percentText} تخفیف`;
  return { active: true, tier, percent, percentText, savings, compareAt: compareAtPrice, label, shortLabel: percentText };
};
