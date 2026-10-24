import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { fa, jFull, addDaysJ } from './lib/format';
import { createMockOrders, calc, type Order, type OrderStatus } from './lib/mock';
import { authApi, ordersApi, setActiveStoreId, storesApi, type AdminSession, type StoreSummary, type StoreOrder } from './lib/api';
import Dashboard, { CatalogOnlySummary } from './views/Dashboard';
import Login from './views/Login';
import Orders from './views/Orders';
import Products from './views/Products';
import AccessManagement from './views/AccessManagement';
import ChangePassword from './views/ChangePassword';
import InstallmentPlans from './views/InstallmentPlans';

export type View = 'dashboard' | 'orders' | 'products' | 'access' | 'installmentPlans';
export type Tab = 'pending' | 'waitingPayment' | 'approved' | 'awaitingDriver' | 'delivered' | 'settled' | 'rejected';

const mapOrder = (order: StoreOrder): Order => {
  const status: OrderStatus = order.status === 'AwaitingSellerApproval' ? 'pending'
    : order.status === 'AwaitingFirstPayment' ? 'waitingPayment'
      : order.status === 'AwaitingDriverConfirm' ? 'awaitingDriver'
        : order.status === 'Delivered' ? 'delivered'
          : order.status === 'Rejected' ? 'rejected' : 'approved';
  const daysSince = Math.max(0, Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 86400000));
  const plateParts = (order.fleetPlate ?? '').split(/\s+(?:ایران|iran)\s+/i);
  const plate: [string, string] = order.fleetPlate
    ? [plateParts[0], plateParts[1] ?? '']
    : ['—', ''];
  return {
    id: `api-${order.id}`,
    apiId: order.id,
    apiStatus: order.status,
    paymentMode: order.paymentMode,
    createdAt: order.createdAt,
    no: order.proformaNumber,
    driver: 'راننده اپ',
    fleet: order.fleetType || (order.paymentMode === 'Cash' ? 'سفارش نقدی' : order.fleetId ? `ناوگان ${fa(order.fleetId)}` : 'بدون ناوگان'),
    plate,
    truck: order.fleetType || 'درخواست خرید تایر',
    dAgo: daysSince,
    fromApp: true,
    items: order.items.map((item) => ({ b: item.title, s: item.size, q: item.quantity, p: item.unitPrice })),
    total: order.total,
    down: order.paymentMode === 'Cash' ? order.total : order.downPayment ?? 0,
    fin: order.paymentMode === 'Cash' ? 0 : order.total - (order.downPayment ?? 0),
    status,
    code: order.deliveryCode?.replace(/^BNPL-/, '') ?? '',
  };
};

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {children}
  </svg>
);

const NAV: { id: View; label: string; icon: ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'داشبورد',
    icon: svg(
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </>,
    ),
  },
  {
    id: 'orders',
    label: 'سفارش‌ها',
    icon: svg(
      <>
        <path d="M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z" />
        <path d="M8 2v4M16 2v4M7 10h10M7 14h7" />
      </>,
    ),
  },
  {
    id: 'products',
    label: 'محصولات',
    icon: svg(
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
      </>,
    ),
  },
  {
    id: 'access',
    label: 'فروشگاه و کاربران',
    icon: svg(<><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20z" /><path d="M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 2.5 4.3V20" /></>),
  },
  {
    id: 'installmentPlans',
    label: 'مدیریت اقساط',
    icon: svg(<><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h5M8 16h3" /><circle cx="17" cy="16" r="2.5" /></>),
  },
];

export default function App() {
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);
  const [view, setView] = useState<View>('dashboard');
  const [tab, setTab] = useState<Tab>('pending');
  const [storeName, setStoreName] = useState('');
  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [activeStoreId, setSelectedStoreId] = useState<number | null>(null);
  const isDemo = import.meta.env.DEV;
  const demoOrders = useMemo(() => isDemo ? createMockOrders() : [], [isDemo]);
  const [orders, setOrders] = useState<Order[]>(() => isDemo ? demoOrders.map((order) => ({ ...order, isDemo: true })) : []);
  const [ordersError, setOrdersError] = useState('');
  const dashboardOrders = isDemo ? demoOrders : orders;
  const stats = useMemo(() => calc(dashboardOrders), [dashboardOrders]);
  const pending = orders.filter((order) => order.status === 'pending').length;

  useEffect(() => {
    let active = true;
    void authApi.csrf().then(() => authApi.me()).then((current) => {
      if (active) setSession(current);
    }).catch(() => {
      if (active) setSession(null);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!session) return;
    let active = true;
    const loadStores = session.permissions.includes('platform.stores.manage')
      ? storesApi.adminList()
      : storesApi.list().then(items => items.filter(store => session.storeIds.includes(store.id)));
    void loadStores.then((items) => {
      if (active) {
        setStores(items);
        const selected = items.find(store => store.id === activeStoreId) ?? items[0];
        setSelectedStoreId(selected?.id ?? null);
        setStoreName(selected?.name ?? '');
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [session]);

  useEffect(() => { setActiveStoreId(activeStoreId); }, [activeStoreId]);

  useEffect(() => {
    if (!session) return;
    if (!isDemo) return;
    let active = true;
    const loadOrders = async () => {
      try {
        const items = await ordersApi.list();
        if (active) {
          setOrders((current) => [...items.map(mapOrder), ...(isDemo ? current.filter((order) => order.isDemo) : [])]);
          setOrdersError('');
        }
      } catch {
        if (active) setOrdersError('بارگذاری سفارش‌ها از سرور ناموفق بود. اتصال را بررسی و دوباره تلاش کنید.');
      }
    };
    void loadOrders();
    const timer = window.setInterval(loadOrders, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [session, activeStoreId, isDemo]);

  const login = async (username: string, password: string) => {
    await authApi.csrf();
    const current = await authApi.login(username, password);
    await authApi.csrf();
    setSession(current);
  };

  const logout = async () => {
    await authApi.logout();
    setSession(null);
  };
  const changePassword = async (current: string, next: string) => setSession(await authApi.changePassword(current, next));

  const refreshOrders = async () => {
    try {
      const items = await ordersApi.list();
      setOrders((current) => [...items.map(mapOrder), ...(isDemo ? current.filter((order) => order.isDemo) : [])]);
      setOrdersError('');
    } catch (error) {
      setOrdersError('به‌روزرسانی سفارش‌ها از سرور ناموفق بود.');
      throw error;
    }
  };

  const go = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openPending = () => {
    setTab('pending');
    go('orders');
  };

  const visibleNav = NAV.filter(item => item.id !== 'access' || session?.permissions.includes('platform.stores.manage'))
    .filter(item => item.id !== 'products' || session?.permissions.includes('catalog.products.read'))
    .filter(item => item.id !== 'orders' || (isDemo && session?.permissions.includes('orders.read')))
    .filter(item => item.id !== 'installmentPlans' || session?.permissions.includes('platform.installment-plans.manage'));
  const navButtons = visibleNav.map((item) => (
    <button
      key={item.id}
      className={`nav-item${view === item.id ? ' active' : ''}`}
      aria-current={view === item.id ? 'page' : 'false'}
      onClick={() => go(item.id)}
    >
      {item.icon}
      {item.label}
    </button>
  ));

  if (session === undefined) return <main className="auth-loading" aria-live="polite">در حال بررسی نشست…</main>;
  if (session === null) return <Login onLogin={login} />;
  if (session.mustChangePassword) return <ChangePassword onChange={changePassword} onLogout={logout} />;

  return (
    <>
      <header className="hdr">
        <div className="hdr-in">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8h12v8H2zM14 11h4l3 3v2h-7" />
              <circle cx="6" cy="18" r="1.8" />
              <circle cx="17" cy="18" r="1.8" />
            </svg>
          </div>
          <div className="hdr-t">
            <h1>{storeName || 'پنل مدیریت فروشگاه'} {storeName && <span className="tag green">✓ فعال</span>}
            </h1>
            <p>{isDemo
              ? `${pending > 0 ? `${fa(pending)} پیش‌فاکتور در انتظار تأییدت هست` : 'همه‌چیز بررسی شده ✅'} · پنل فروشنده`
              : 'انتشار کاتالوگ · خرید در حال آماده‌سازی · پنل فروشنده'}</p>
          </div>
          <div className="hdr-act">
            {stores.length > 1 && <select className="store-switcher" aria-label="انتخاب فروشگاه" value={activeStoreId ?? ''} onChange={event => { const id = Number(event.target.value); setSelectedStoreId(id); setStoreName(stores.find(store => store.id === id)?.name ?? ''); }}><option value="" disabled>انتخاب فروشگاه</option>{stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}</select>}
            <span className="datechip">امروز، {jFull(addDaysJ(0))}</span>
            {isDemo && <button className="bell" aria-label="اعلان‌ها" onClick={openPending}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" />
              <path d="M10 20a2.2 2.2 0 0 0 4 0" />
            </svg>
              <span className={`bbadge${pending === 0 ? ' hide' : ''}`}>{fa(pending)}</span>
            </button>}
            <button className="auth-logout" onClick={() => void logout()} title={`خروج از حساب ${session.displayName}`}>
              خروج
            </button>
            <div className="av" title={session.displayName}>{session.displayName.slice(0, 1)}</div>
          </div>
        </div>
      </header>

      <nav className="sidebar" aria-label="ناوبری اصلی">
        <div className="side-brand">
          <span className="logo" style={{ width: 34, height: 34, borderRadius: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M2 8h12v8H2zM14 11h4l3 3v2h-7" />
              <circle cx="6" cy="18" r="1.8" />
              <circle cx="17" cy="18" r="1.8" />
            </svg>
          </span>
          پنل فروشنده
        </div>
        {navButtons}
      </nav>
      <nav className="bottom-nav" aria-label="ناوبری موبایل">
        {navButtons}
      </nav>

      <div className="wrap">
        {ordersError && <p role="alert" className="orders-error">{ordersError}</p>}
        <section className="view" hidden={view !== 'dashboard'}>
          {isDemo
            ? <Dashboard orders={dashboardOrders} stats={stats} onReview={openPending} />
            : <CatalogOnlySummary onManageProducts={() => go('products')} />}
        </section>
        <section className="view" hidden={view !== 'orders'}>
          <Orders orders={orders} setOrders={setOrders} tab={tab} setTab={setTab}
            onApproveApi={async (id) => { await ordersApi.approve(id); await refreshOrders(); }}
            onRejectApi={async (id) => { await ordersApi.reject(id); await refreshOrders(); }}
            onDeliverApi={async (id, code) => { await ordersApi.sellerDeliver(id, code); await refreshOrders(); }} />
        </section>
        <section className="view" hidden={view !== 'products'}>
          {view === 'products' && <Products />}
        </section>
        <section className="view" hidden={view !== 'access'}>
          {view === 'access' && <AccessManagement />}
        </section>
        <section className="view" hidden={view !== 'installmentPlans'}>
          {view === 'installmentPlans' && <InstallmentPlans storeId={activeStoreId} stores={stores} />}
        </section>
      </div>
    </>
  );
}
