import { useFeedback } from '../lib/feedback';
import { addDaysJ, dayDiff, fa, jShort, money } from '../lib/format';
import type { calc, Order } from '../lib/mock';

type Stats = ReturnType<typeof calc>;
const ACTIVE = ['approved', 'delivered', 'settled'];
const DAYS = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];

export function CatalogOnlySummary({ onManageProducts }: { onManageProducts: () => void }) {
  return (
    <div className="panel catalog-only-summary">
      <h3>انتشار مرحله‌ای فروشگاه</h3>
      <p>مدیریت کاتالوگ و موجودی فعال است. سفارش، اعتبار و پرداخت پس از اتصال هویت ERP و پایدارشدن گردش مالی فعال می‌شود.</p>
      <button className="mini-btn" onClick={onManageProducts}>مدیریت محصولات</button>
    </div>
  );
}

const icon = (children: React.ReactNode) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

function Chart({ orders }: { orders: Order[] }) {
  const vals = Array<number>(7).fill(0);
  orders.forEach((o) => {
    if (ACTIVE.includes(o.status) && o.dAgo < 7) vals[6 - o.dAgo] += o.total / 1e6;
  });
  const max = Math.max(5, Math.ceil(Math.max(...vals) / 5) * 5);
  const plotH = 150;
  const base = 190;
  return (
    <svg viewBox="0 0 720 225">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#35C4CE" />
          <stop offset="1" stopColor="#7FD3DC" />
        </linearGradient>
        <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0097A9" />
          <stop offset="1" stopColor="#4FBAC6" />
        </linearGradient>
      </defs>
      {[1, 2, 3].map((g) => (
        <line key={g} x1="10" x2="710" y1={base - (plotH * g) / 4} y2={base - (plotH * g) / 4} stroke="#EEF3F4" strokeWidth="1" />
      ))}
      {vals.map((v, i) => {
        const x = 10 + i * 100 + 21;
        const h = v > 0 ? Math.max(8, (v / max) * plotH) : 4;
        const y = base - h;
        const today = i === 6;
        const day = new Date(Date.now() - (6 - i) * 864e5).getDay() % 7;
        const label = v >= 10 ? String(Math.round(v)) : String(Math.round(v * 10) / 10).replace('.', '٫');
        return (
          <g key={i}>
            {v > 0 ? (
              <>
                <rect x={x} y={y} width="58" height={h} rx="9" fill={`url(#g${today ? 'H' : ''})`}>
                  <title>{`${fa(v.toFixed(1))} میلیون`}</title>
                </rect>
                <text x={x + 29} y={y - 8} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={today ? '#007D8C' : '#4B5B66'} fontFamily="Vazirmatn">
                  {fa(label)}
                </text>
              </>
            ) : (
              <rect x={x + 22} y={base - 4} width="14" height="4" rx="2" fill="#D9E2E6" />
            )}
            <text x={x + 29} y="212" textAnchor="middle" fontSize="11.5" fontWeight={today ? 900 : 700} fill={today ? '#007D8C' : '#8B9AA3'} fontFamily="Vazirmatn">
              {DAYS[day]}
            </text>
          </g>
        );
      })}
      <line x1="10" x2="710" y1="190" y2="190" stroke="#E1E9EC" strokeWidth="1.5" />
    </svg>
  );
}

export default function Dashboard({ orders, stats, onReview }: { orders: Order[]; stats: Stats; onReview: () => void }) {
  const { toast } = useFeedback();
  const debts = orders.filter((o) => o.status === 'delivered');
  const cards = [
    { cls: 'teal', lbl: 'فروش کل (تأییدشده)', val: stats.total, sub: `${fa(stats.totalN)} سفارش تأییدشده`, ic: icon(<><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>) },
    { cls: 'green', lbl: 'فروش امروز', val: stats.today, sub: `${fa(stats.todayN)} سفارش امروز`, ic: icon(<><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></>) },
    { cls: 'amber', lbl: 'طلب از سامانه', val: stats.debt, sub: `${fa(stats.debtN)} فاکتور تحویل‌شده در انتظار واریز`, ic: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>) },
    { cls: 'violet', lbl: 'تسویه‌شده (واریزی سامانه)', val: stats.settled, sub: `${fa(stats.settledN)} فاکتور تسویه‌شده`, ic: icon(<><path d="M12 2l8 3.5v5.7c0 5-3.4 9.3-8 10.8-4.6-1.5-8-5.8-8-10.8V5.5L12 2z" /><path d="M8.5 12l2.4 2.4L15.5 9.5" /></>) },
  ];

  return (
    <>
      {stats.pendingN > 0 && (
        <div className="strip">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="3" />
            <path d="M9 8h6M9 12h6M9 16h3" />
          </svg>
          <p>
            <b>{fa(stats.pendingN)} پیش‌فاکتور جدید</b> برای تأیید داری<small>با تأیید، کد تحویل راننده فعال می‌شه.</small>
          </p>
          <button onClick={onReview}>بررسی سفارش‌ها</button>
        </div>
      )}

      <div className="stats">
        {cards.map((c) => (
          <div className="stat" key={c.lbl}>
            <div className={`ic ${c.cls}`}>{c.ic}</div>
            <div className="lbl">{c.lbl}</div>
            <div className="val">
              {money(c.val)} <small>تومان</small>
            </div>
            <div className="sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="row2">
        <div className="panel chart">
          <h3>
            فروش ۷ روز اخیر <span className="ln"></span>
            <span className="pill">میلیون تومان</span>
          </h3>
          <div id="chartBox">
            <Chart orders={orders} />
          </div>
          <div className="cap">● امروز — فقط سفارش‌های تأییدشده محاسبه می‌شن.</div>
        </div>
        <div className="panel">
          <h3>
            طلبکاری از سامانه <span className="ln"></span>
          </h3>
          <div className="debt-big">
            <b>{money(stats.debt)}</b>
            <small>تومان در انتظار واریز</small>
          </div>
          <div className="debt-list">
            {debts.length === 0 ? (
              <div className="debt-empty">طلب فعلی نداری — همه تسویه شده ✅</div>
            ) : (
              debts.map((o) => {
                const diff = o.settleDate ? dayDiff(o.settleDate) : 0;
                const due = diff <= 0 ? 'امروز' : diff === 1 ? 'فردا' : jShort(o.settleDate ?? addDaysJ(0));
                return (
                  <div className="debt-item" key={o.id}>
                    <div className="n">
                      {o.no}
                      <small>{o.driver}</small>
                    </div>
                    <span className="tag violet">{due}</span>
                    <span className="a">{money(o.fin)}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="debt-foot">
            <span>نقدی دریافت‌شده از رانندگان (پیش‌پرداخت‌ها)</span>
            <b>{money(stats.cash)} تومان</b>
          </div>
          <button className="mini-btn" onClick={() => toast('تسویه فوری ثبت شد — تا ۲۴ ساعت آینده واریز می‌شه 💸')}>
            تسویه فوری
          </button>
        </div>
      </div>
    </>
  );
}
