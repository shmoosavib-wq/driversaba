import { useEffect, useState } from 'react';
import { installmentPlansApi, type StoreInstallmentPlan, type StoreInstallmentPlanInput, type StoreSummary } from '../lib/api';
import './InstallmentPlans.css';

type Props = { storeId: number | null; stores: StoreSummary[] };
type DraftPlan = { installmentCount: 2 | 4; feePercent: string; isActive: boolean };

const initialPlans: DraftPlan[] = [
  { installmentCount: 2, feePercent: '7', isActive: false },
  { installmentCount: 4, feePercent: '7', isActive: true },
];

const toDraft = (plan: StoreInstallmentPlan): DraftPlan => ({
  installmentCount: plan.installmentCount,
  feePercent: String(Number((plan.feeRate * 100).toFixed(2))),
  isActive: plan.isActive,
});

export default function InstallmentPlans({ storeId, stores }: Props) {
  const [plans, setPlans] = useState<DraftPlan[]>(initialPlans);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const storeName = stores.find(store => store.id === storeId)?.name;

  useEffect(() => {
    if (!storeId) return;
    let active = true;
    setLoading(true);
    setError('');
    setSuccess('');
    void installmentPlansApi.forStore(storeId).then((items) => {
      if (!active) return;
      setPlans(items.length ? items.map(toDraft) : initialPlans);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'دریافت تنظیمات اقساط ناموفق بود.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [storeId]);

  const updatePlan = (count: 2 | 4, update: Partial<DraftPlan>) => {
    setPlans(current => current.map(plan => plan.installmentCount === count ? { ...plan, ...update } : plan));
    setSuccess('');
  };

  const invalidFee = plans.some(plan => {
    const rate = Number(plan.feePercent);
    return plan.feePercent.trim() === '' || !Number.isFinite(rate) || rate < 0 || rate > 100 || Math.round(rate * 100) !== rate * 100;
  });

  const save = async () => {
    if (!storeId || invalidFee || saving) return;
    setSaving(true);
    setError('');
    setSuccess('');
    const input: StoreInstallmentPlanInput[] = plans.map(plan => ({
      installmentCount: plan.installmentCount,
      feeRate: Number(plan.feePercent) / 100,
      isActive: plan.isActive,
    }));
    try {
      const saved = await installmentPlansApi.saveForStore(storeId, input);
      setPlans(saved.map(toDraft));
      setSuccess(`تنظیمات اقساط ${storeName ?? 'فروشگاه'} ذخیره شد.`);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'ذخیره تنظیمات ناموفق بود.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="installment-plans-page" aria-labelledby="installment-plans-title">
      <header className="installment-plans-header">
        <div>
          <h2 id="installment-plans-title">مدیریت اقساط</h2>
          <p>روش‌های پرداخت و کارمزد را برای هر فروشگاه جداگانه تنظیم کنید.</p>
        </div>
        {storeName && <span className="installment-store-chip">{storeName}</span>}
      </header>
      {!storeId ? <div className="installment-plans-notice">برای تنظیم اقساط، ابتدا فروشگاه را از نوار بالای پنل انتخاب کنید.</div> : <>
        <div className="installment-plans-grid" aria-busy={loading}>
          {plans.map(plan => <section className={`installment-plan-card${plan.isActive ? ' active' : ''}`} key={plan.installmentCount}>
            <div className="installment-plan-card-head">
              <div><span className="installment-plan-kicker">پرداخت در</span><h3>{plan.installmentCount} قسط</h3></div>
              <label className="installment-plan-toggle">
                <input type="checkbox" checked={plan.isActive} disabled={loading || saving} onChange={event => updatePlan(plan.installmentCount, { isActive: event.target.checked })} />
                <span>{plan.isActive ? 'فعال' : 'غیرفعال'}</span>
              </label>
            </div>
            <label className="installment-fee-label" htmlFor={`installment-fee-${plan.installmentCount}`}>کارمزد این روش</label>
            <div className="installment-fee-input">
              <input id={`installment-fee-${plan.installmentCount}`} type="number" inputMode="decimal" min="0" max="100" step="0.01" value={plan.feePercent} disabled={loading || saving} aria-describedby={`installment-fee-help-${plan.installmentCount}`} onChange={event => updatePlan(plan.installmentCount, { feePercent: event.target.value })} />
              <span>٪</span>
            </div>
            <small id={`installment-fee-help-${plan.installmentCount}`}>درصد کارمزد روی مبلغی که از اعتبار تأمین می‌شود محاسبه می‌شود.</small>
          </section>)}
        </div>
        {error && <p className="installment-plans-message error" role="alert">{error}</p>}
        {success && <p className="installment-plans-message success" role="status">{success}</p>}
        {invalidFee && <p className="installment-plans-message error" role="alert">کارمزد هر روش باید بین صفر تا ۱۰۰ و با حداکثر دو رقم اعشار باشد.</p>}
        <div className="installment-plans-footer">
          <p>راننده فقط روش‌های فعال این فروشگاه را می‌بیند. سفارش‌های ثبت‌شده با تغییر این تنظیمات تغییر نمی‌کنند.</p>
          <button type="button" className="installment-save-button" disabled={!storeId || loading || saving || invalidFee} onClick={() => void save()}>{saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}</button>
        </div>
      </>}
    </main>
  );
}
