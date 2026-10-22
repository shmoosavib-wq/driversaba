import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { Tab } from '../App';
import { useFeedback } from '../lib/feedback';
import { addDaysJ, dayDiff, fa, jFull, jShort, money } from '../lib/format';
import { STATUS_META, type Order } from '../lib/mock';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pending', label: 'در انتظار تأیید' },
  { id: 'waitingPayment', label: 'در انتظار پرداخت راننده' },
  { id: 'approved', label: 'آماده تحویل' },
  { id: 'awaitingDriver', label: 'در انتظار تأیید راننده' },
  { id: 'delivered', label: 'در انتظار تسویه' },
  { id: 'settled', label: 'تسویه‌شده' },
  { id: 'rejected', label: 'ردشده' },
];

const EMPTIES: Record<Tab, [string, string, string]> = {
  pending: ['📋', 'همهٔ پیش‌فاکتورها بررسی شدن', 'سفارش جدید از اپ راننده‌ها همین‌جا می‌افته.'],
  waitingPayment: ['💳', 'سفارشی در انتظار پرداخت نیست', 'پس از تأیید پیش‌فاکتور، راننده قسط اول را پرداخت می‌کند.'],
  approved: ['📦', 'سفارشی آمادهٔ تحویل نیست', 'بعد از تأیید، سفارش‌ها این‌جا می‌افته.'],
  awaitingDriver: ['🤝', 'تأیید تحویلی در انتظار نیست', 'بعد از ثبت تحویل فروشنده، تأیید نهایی با راننده است.'],
  delivered: ['💳', 'طلب معوقی نداری', 'فاکتورهای تحویل‌شده تا روز واریز این‌جان.'],
  settled: ['✅', 'هنوز فروشی تسویه نشده', 'اولین واریزی سامانه این‌جا ثبت می‌شه.'],
  rejected: ['↩️', 'سفارش ردشده‌ای نیست', 'پیش‌فاکتورهای ردشده این‌جا می‌مانند.'],
};

const Plate = ({ num, prov }: { num: string; prov: string }) => (
  <span className="plate">
    <span className="blue">
      <span className="flag"></span>
      <b>I.R·IRAN</b>
    </span>
    <span className="num">{num}</span>
    {prov && <span className="prov">
      <small>ایران</small>
      <b>{prov}</b>
    </span>}
  </span>
);

interface Props {
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  tab: Tab;
  setTab: (tab: Tab) => void;
  onApproveApi: (id: number) => Promise<void>;
  onRejectApi: (id: number) => Promise<void>;
  onDeliverApi: (id: number, code: string) => Promise<void>;
}

export default function Orders({ orders, setOrders, tab, setTab, onApproveApi, onRejectApi, onDeliverApi }: Props) {
  const { toast, confetti } = useFeedback();
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [modal, setModal] = useState<Order | null>(null);

  const patch = (id: string, change: Partial<Order>) =>
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...change } : o)));

  const approve = async (o: Order) => {
    if (o.apiId) {
      try { await onApproveApi(o.apiId); confetti(); toast('پیش‌فاکتور تأیید شد؛ قسط اول برای پرداخت راننده فعال شد.'); }
      catch { toast('تأیید سفارش انجام نشد. اتصال سرور را بررسی کن.'); }
      return;
    }
    patch(o.id, { status: 'approved' });
    confetti();
    toast('پیش‌فاکتور تأیید شد؛ پرداخت قسط اول برای راننده فعال شد.');
  };
  const reject = async (o: Order) => {
    if (o.apiId) {
      try { await onRejectApi(o.apiId); setRejecting(null); toast('پیش‌فاکتور رد و موجودی آزاد شد.'); }
      catch { toast('رد سفارش انجام نشد. اتصال سرور را بررسی کن.'); }
      return;
    }
    patch(o.id, { status: 'rejected' });
    setRejecting(null);
    toast('پیش‌فاکتور رد شد و به راننده اطلاع داده شد');
  };
  const settle = (o: Order) => {
    const ref = `TR-${Math.floor(10000 + Math.random() * 89999)}`;
    patch(o.id, { status: 'settled', ref, settleJ: addDaysJ(0) });
    toast(`واریز ${money(o.fin)} تومان انجام شد · کد پیگیری ${ref} ✅`);
  };
  const toggleCode = (id: string) =>
    setShown((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const delivered = async (o: Order, code: string) => {
    if (o.apiId) {
      try { await onDeliverApi(o.apiId, code); setModal(null); toast('تحویل اعلام شد؛ برای تأیید تطابق کالا به راننده ارسال شد.'); setTab('awaitingDriver'); }
      catch { toast('ثبت تحویل انجام نشد. اتصال سرور را بررسی کن.'); }
      return;
    }
    const settleDate = addDaysJ(2);
    patch(o.id, { status: 'delivered', settleDate });
    setModal(null);
    confetti();
    toast(
      o.down > 0
        ? `تحویل ثبت شد ✅ پیش‌پرداخت ${money(o.down)} تومان نقدی دریافت شد — واریز سامانه تا ${jFull(settleDate)}`
        : `تحویل ثبت شد ✅ واریز سامانه تا ${jFull(settleDate)}`,
    );
    setTab('delivered');
  };

  const counts: Record<Tab, number> = { pending: 0, waitingPayment: 0, approved: 0, awaitingDriver: 0, delivered: 0, settled: 0, rejected: 0 };
  orders.forEach((o) => counts[o.status]++);
  const list = orders.filter((o) => o.status === tab);
  const [emoji, title, hint] = EMPTIES[tab];

  return (
    <>
      <div className="sec-h">
        <h2>سفارش‌ها</h2>
        <span className="ln"></span>
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab${tab === t.id ? ' on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label} <span className="cnt">{fa(counts[t.id])}</span>
          </button>
        ))}
      </div>
      <div className="ocards">
        {list.length === 0 ? (
          <div className="empty">
            <div className="em">{emoji}</div>
            {title}
            <small>{hint}</small>
          </div>
        ) : (
          list.map((o) => (
            <OrderCard
              key={o.id}
              o={o}
              codeShown={shown.has(o.id)}
              rejecting={rejecting === o.id}
              onApprove={() => approve(o)}
              onAskReject={() => setRejecting(o.id)}
              onCancelReject={() => setRejecting(null)}
              onReject={() => reject(o)}
              onEye={() => toggleCode(o.id)}
              onDeliver={() => setModal(o)}
              onSettle={() => settle(o)}
            />
          ))
        )}
      </div>
      {modal && <DeliverModal order={modal} onClose={() => setModal(null)} onSuccess={(code) => delivered(modal, code)} />}
    </>
  );
}

interface CardProps {
  o: Order;
  codeShown: boolean;
  rejecting: boolean;
  onApprove: () => void;
  onAskReject: () => void;
  onCancelReject: () => void;
  onReject: () => void;
  onEye: () => void;
  onDeliver: () => void;
  onSettle: () => void;
}

function OrderCard({ o, codeShown, rejecting, onApprove, onAskReject, onCancelReject, onReject, onEye, onDeliver, onSettle }: CardProps) {
  const st = o.apiStatus === 'AwaitingFirstPayment' ? { t: o.paymentMode === 'Cash' ? 'در انتظار پرداخت نقدی' : 'در انتظار پرداخت قسط اول', c: 'amber' }
    : o.apiStatus === 'AwaitingDriverConfirm' ? { t: 'در انتظار تأیید راننده', c: 'violet' }
      : o.apiStatus === 'Delivered' ? { t: 'تحویل‌شده', c: 'green' }
        : o.apiStatus === 'Approved' ? { t: 'آماده تحویل', c: 'teal' }
          : o.apiStatus === 'Rejected' ? { t: 'رد شده', c: 'amber' }
            : STATUS_META[o.status];
  const date = jShort(addDaysJ(-o.dAgo));
  return (
    <article className="ocard">
      <div>
        <div className="o-head">
          <span className="o-no">{o.no}</span>
          <span className={`tag ${st.c}`}>{st.t}</span>
          <span className="o-date">
            {o.dAgo === 0 ? 'امروز' : `${fa(o.dAgo)} روز پیش`} · {date}
          </span>
          {o.fromApp && <span className="tag teal">ارسالی از اپ راننده</span>}
          {o.isDemo && <span className="tag amber">نمونه آزمایشی</span>}
        </div>
        <div className="o-driver">
          <span className="dav">{o.driver.trim()[0]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nm">{o.driver}</div>
            <div className="fl">
              {o.fleet} · {o.truck}
            </div>
          </div>
          <Plate num={o.plate[0]} prov={o.plate[1]} />
        </div>
        <div className="o-items">
          {o.items.map((it, i) => (
            <span className="ichip" key={i}>
              <b>{it.b}</b> ×{fa(it.q)} <small style={{ color: 'var(--muted)' }}>({it.s})</small>
            </span>
          ))}
        </div>
        {o.status === 'approved' && (!o.apiId || o.apiStatus === 'Approved') && (
          <div className="codechip">
            <span>
              کد تحویل راننده: <span className="code">{codeShown ? o.code : '• • • • •'}</span>
            </span>
            <button className="eye" aria-label="نمایش کد" onClick={onEye}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        )}
        {o.status === 'delivered' && o.settleDate && (
          <div className="settle-line">
            🗓 واریز سامانه: {dayDiff(o.settleDate) <= 0 ? 'امروز' : dayDiff(o.settleDate) === 1 ? 'فردا' : jFull(o.settleDate)} — {money(o.fin)} تومان
          </div>
        )}
        {o.status === 'settled' && o.settleJ && (
          <div className="ok-line">
            ✓ واریز شد · {jFull(o.settleJ)}
            <span className="ref">{o.ref}</span>
          </div>
        )}
      </div>
      <div>
        <div className="o-sums">
          <div className="srow"><span>مبلغ فاکتور</span><b>{money(o.total)}</b></div>
          {o.down > 0 && <div className="srow"><span>پیش‌پرداخت (نقدی از راننده)</span><b>{money(o.down)}</b></div>}
          <div className="srow"><span>اعتبار (واریز سامانه)</span><b>{money(o.fin)}</b></div>
          <div className="srow tot"><span>دریافتی شما</span><b>{money(o.total)}</b></div>
          <div className="freefee">✨ بدون کارمزد برای فروشگاه</div>
        </div>
        <div className="o-actions">
          {o.status === 'pending' &&
            (rejecting ? (
              <>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--muted)', alignSelf: 'center' }}>مطمئنی؟</span>
                <button className="btn pink-o" style={{ flex: '0 0 auto', padding: '0 14px' }} onClick={onReject}>بله، رد کن</button>
                <button className="btn ghost" style={{ flex: '0 0 auto', padding: '0 14px' }} onClick={onCancelReject}>انصراف</button>
              </>
            ) : (
              <>
                <button className="btn primary" onClick={onApprove}>تأیید پیش‌فاکتور و فعال‌سازی پرداخت</button>
                <button className="btn pink-o" onClick={onAskReject}>رد</button>
              </>
            ))}
          {o.status === 'approved' && (!o.apiId || o.apiStatus === 'Approved') && <button className="btn primary" onClick={onDeliver}>بررسی کد و اعلام تحویل</button>}
          {o.status === 'delivered' && (
            <button className="btn ghost" style={{ fontSize: 12 }} onClick={onSettle}>شبیه‌سازی واریز (دمو)</button>
          )}
        </div>
      </div>
    </article>
  );
}

function DeliverModal({ order, onClose, onSuccess }: { order: Order; onClose: () => void; onSuccess: (code: string) => void }) {
  const { toast } = useFeedback();
  const [chars, setChars] = useState<string[]>(['', '', '', '', '']);
  const [err, setErr] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const clean = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const setAt = (i: number, v: string) => setChars((c) => c.map((x, j) => (j === i ? v : x)));

  const confirm = () => {
    const code = chars.join('');
    if (code.length < 5) return toast('کد ۵ رقمی رو کامل وارد کن');
    if (code !== order.code) {
      setErr(true);
      toast('کد با سفارش مطابقت نداره ❌');
      window.setTimeout(() => {
        setErr(false);
        setChars(['', '', '', '', '']);
        refs.current[0]?.focus();
      }, 380);
      return;
    }
    onSuccess(code);
  };

  return (
    <div className="overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>بررسی کد و اعلام تحویل</h3>
        <p className="msub">کد ۵ رقمی راننده را وارد کنید. پس از تأیید کد، تحویل به راننده اعلام می‌شود تا تطابق محصول را بررسی و دریافت را تأیید کند.</p>
        <div className="oinfo">
          <span>{order.no}</span>
          <span style={{ color: 'var(--muted)', fontWeight: 700 }}>{order.driver}</span>
        </div>
        <div className={`otp-row${err ? ' err' : ''}`}>
          {chars.map((ch, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              maxLength={1}
              value={ch}
              onChange={(e) => {
                const v = clean(e.target.value).slice(-1);
                setAt(i, v);
                if (v && i < 4) refs.current[i + 1]?.focus();
              }}
              onKeyDown={(e) => e.key === 'Backspace' && !ch && i > 0 && refs.current[i - 1]?.focus()}
              onPaste={(e) => {
                const txt = clean(e.clipboardData.getData('text'));
                if (!txt) return;
                e.preventDefault();
                setChars(['', '', '', '', ''].map((_, j) => txt[j] ?? ''));
                refs.current[Math.min(4, txt.length - 1)]?.focus();
              }}
            />
          ))}
        </div>
        <div className="mfoot"><span>کد ۵ رقمی را از راننده دریافت کنید؛ تأیید نهایی با راننده است.</span></div>
        <div className="mactions">
          <button className="btn primary" onClick={confirm}>کد صحیح است؛ تحویل داده شد</button>
          <button className="btn ghost" style={{ flex: '0 0 auto', padding: '0 18px' }} onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  );
}
