import { useState } from "react";
import { FBody, FFoot, FHead, FPage } from "./style5";
import { FChip } from "./style3";
import { BarBtn } from "./style3";

export type TireFilters = { brands: string[]; sizes: string[] };
export const EMPTY_FILTERS: TireFilters = { brands: [], sizes: [] };
export const filterCount = (f: TireFilters) => f.brands.length + f.sizes.length;

const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

type Props = { value: TireFilters; brands: string[]; sizes: string[]; resultCount: (f: TireFilters) => number; onApply: (f: TireFilters) => void; onClose: () => void };

export function FilterPage({ value, brands, sizes, resultCount, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<TireFilters>(value);
  const n = resultCount(draft);
  return (
    <FPage>
      <FHead>
        <div>
          <button onClick={onClose} aria-label="بستن"><svg width="10" height="16" viewBox="0 0 8 12" fill="none" stroke="#223038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 1l4 5-4 5" /></svg></button>
          فیلترها
        </div>
        <button className="clear" onClick={() => { setDraft(EMPTY_FILTERS); onApply(EMPTY_FILTERS); }}>حذف همه فیلترها</button>
      </FHead>
      <FBody>
        <section>
          <h4>برند</h4>
          <div className="wrap">{brands.map((b) => <FChip key={b} $on={draft.brands.includes(b)} onClick={() => setDraft({ ...draft, brands: toggle(draft.brands, b) })}>{b}</FChip>)}</div>
        </section>
        <section>
          <h4>سایز</h4>
          <div className="wrap">{sizes.map((s) => <FChip key={s} $on={draft.sizes.includes(s)} onClick={() => setDraft({ ...draft, sizes: toggle(draft.sizes, s) })} style={{ direction: "ltr" }}>{s}</FChip>)}</div>
          <div className="sub" style={{ marginTop: 8 }}>می‌توانی چند برند یا چند سایز را هم‌زمان انتخاب کنی.</div>
        </section>
      </FBody>
      <FFoot>
        <BarBtn style={{ width: "100%" }} disabled={n === 0} onClick={() => onApply(draft)}>
          {n === 0 ? "محصولی با این فیلترها نیست" : `اعمال فیلترها (${n.toLocaleString("fa-IR")} محصول)`}
        </BarBtn>
      </FFoot>
    </FPage>
  );
}