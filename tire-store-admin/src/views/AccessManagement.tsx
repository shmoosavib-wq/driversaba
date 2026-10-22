import { useEffect, useRef, useState } from 'react';
import { storesApi, type ManagedStore, type StoreRole, type StoreUser } from '../lib/api';
import { useFeedback } from '../lib/feedback';
import { fa } from '../lib/format';

const emptyStoreForm = { name: '', address: '', contactPhone: '' };
const emptyUserForm = { username: '', displayName: '', storeId: 0, roleCode: '' };

export default function AccessManagement() {
  const { toast } = useFeedback();
  const [stores, setStores] = useState<ManagedStore[]>([]);
  const [users, setUsers] = useState<StoreUser[]>([]);
  const [roles, setRoles] = useState<StoreRole[]>([]);
  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStore, setSavingStore] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [loadError, setLoadError] = useState('');
  const storeFormRef = useRef<HTMLFormElement>(null);
  const userFormRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    setLoadError('');
    const nextStores = await storesApi.adminList();
    setStores(nextStores);
    const activeStores = nextStores.filter(store => store.isActive);
    setUserForm(current => ({
      ...current,
      storeId: activeStores.some(store => store.id === current.storeId) ? current.storeId : activeStores[0]?.id ?? 0,
    }));

    const [usersResult, rolesResult] = await Promise.allSettled([storesApi.users(), storesApi.roles()]);
    const errors: string[] = [];
    if (usersResult.status === 'fulfilled') setUsers(usersResult.value);
    else errors.push('فهرست کاربران بارگذاری نشد.');
    if (rolesResult.status === 'fulfilled') {
      setRoles(rolesResult.value);
      setUserForm(current => ({ ...current, roleCode: rolesResult.value.some(role => role.code === current.roleCode) ? current.roleCode : rolesResult.value[0]?.code ?? '' }));
    } else errors.push('نقش‌های کاربری بارگذاری نشد.');
    setLoadError(errors.join(' '));
  };

  useEffect(() => {
    void load().catch(error => {
      setLoadError((error as Error).message || 'بارگذاری اطلاعات انجام نشد.');
      toast(`${(error as Error).message} ❌`);
    }).finally(() => setLoading(false));
  }, [toast]);

  const focusForm = (form: HTMLFormElement | null) => {
    form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form?.querySelector<HTMLInputElement | HTMLSelectElement>('input, select')?.focus({ preventScroll: true });
  };

  const addUserForStore = (storeId: number) => {
    setUserForm(current => ({ ...current, storeId }));
    window.setTimeout(() => focusForm(userFormRef.current), 0);
  };

  const createStore = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingStore(true);
    try {
      if (editingStoreId) {
        const current = stores.find(store => store.id === editingStoreId);
        await storesApi.update(editingStoreId, { ...storeForm, isActive: current?.isActive ?? true });
        setEditingStoreId(null);
        setStoreForm(emptyStoreForm);
        await load();
        toast('اطلاعات فروشگاه ذخیره شد ✅');
      } else {
        const created = await storesApi.create(storeForm);
        setStoreForm(emptyStoreForm);
        await load();
        setUserForm(current => ({ ...current, storeId: created.id }));
        toast('فروشگاه ایجاد شد؛ حالا کاربر آن را تعریف کنید ✅');
        window.setTimeout(() => focusForm(userFormRef.current), 0);
      }
    } catch (error) {
      toast(`${(error as Error).message} ❌`);
    } finally {
      setSavingStore(false);
    }
  };

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingUser(true);
    try {
      const result = await storesApi.createUser(userForm);
      setTemporaryPassword(result.temporaryPassword);
      setUserForm(current => ({ ...current, username: '', displayName: '' }));
      await load();
      toast('کاربر فروشگاه ساخته شد ✅');
    } catch (error) {
      toast(`${(error as Error).message} ❌`);
    } finally {
      setSavingUser(false);
    }
  };

  const toggleStore = async (store: ManagedStore) => {
    try {
      await storesApi.update(store.id, { name: store.name, address: store.address, contactPhone: store.contactPhone, isActive: !store.isActive });
      await load();
      toast(store.isActive ? 'فروشگاه غیرفعال شد' : 'فروشگاه فعال شد ✅');
    } catch (error) {
      toast(`${(error as Error).message} ❌`);
    }
  };

  const toggleUser = async (user: StoreUser) => {
    try {
      await storesApi.setUserActive(user.membershipId, !user.isActive);
      await load();
      toast(user.isActive ? 'دسترسی کاربر غیرفعال شد' : 'دسترسی کاربر فعال شد ✅');
    } catch (error) {
      toast(`${(error as Error).message} ❌`);
    }
  };

  const activeStores = stores.filter(store => store.isActive);

  return <section className="access-page" dir="rtl">
    <div className="access-hero">
      <div>
        <span className="access-eyebrow">مدیریت دسترسی‌ها</span>
        <h2>فروشگاه‌ها و کاربران</h2>
        <p>اول فروشگاه را تعریف کنید؛ سپس از همان کارت، کاربر و نقش او را بسازید.</p>
      </div>
      <div className="access-hero-actions">
        <button className="access-primary-btn" type="button" onClick={() => focusForm(storeFormRef.current)}>
          <span aria-hidden="true">＋</span> تعریف فروشگاه
        </button>
        <button className="access-secondary-btn" type="button" disabled={!activeStores.length} onClick={() => focusForm(userFormRef.current)}>
          افزودن کاربر
        </button>
      </div>
    </div>

    <div className="access-stats" aria-label="خلاصه فروشگاه‌ها و کاربران">
      <div><span>فروشگاه فعال</span><b>{fa(activeStores.length)}</b></div>
      <div><span>کاربر تعریف‌شده</span><b>{fa(users.length)}</b></div>
    </div>

    <section className="access-panel access-list" aria-labelledby="stores-heading">
      <div className="access-section-head">
        <div><h3 id="stores-heading">فروشگاه‌ها</h3><p>فروشگاه موردنظر را انتخاب کنید تا کاربرش را اضافه کنید.</p></div>
        <button type="button" className="access-primary-btn access-small-cta" onClick={() => focusForm(storeFormRef.current)}>＋ فروشگاه جدید</button>
      </div>
      {loading ? <p className="access-empty" role="status">در حال دریافت فروشگاه‌ها…</p>
        : loadError && stores.length === 0 ? <div className="access-empty access-error" role="alert">دریافت فروشگاه‌ها ناموفق بود. صفحه را تازه‌سازی کنید یا دوباره وارد شوید.</div>
          : stores.length === 0 ? <div className="access-empty"><b>هنوز فروشگاهی تعریف نشده</b><span>با ساخت اولین فروشگاه، می‌توانید کاربران و محصولات آن را مدیریت کنید.</span><button type="button" className="access-primary-btn" onClick={() => focusForm(storeFormRef.current)}>تعریف اولین فروشگاه</button></div>
            : <div className="store-card-grid">{stores.map(store => {
              const storeUsers = users.filter(user => user.storeId === store.id);
              return <article className={`store-card${store.isActive ? '' : ' is-inactive'}`} key={store.id}>
                <div className="store-card-top"><span className={`tag ${store.isActive ? 'green' : 'gray'}`}>{store.isActive ? 'فعال' : 'غیرفعال'}</span><span className="store-card-icon" aria-hidden="true">▣</span></div>
                <h4>{store.name}</h4>
                <p>{store.address}</p>
                <div className="store-card-meta"><span>{fa(store.productCount)} محصول</span><span>{fa(storeUsers.length)} کاربر</span></div>
                <div className="store-card-actions">
                  <button type="button" className="access-primary-btn" disabled={!store.isActive} onClick={() => addUserForStore(store.id)}>＋ افزودن کاربر</button>
                  <button type="button" className="outline-btn" onClick={() => { setEditingStoreId(store.id); setStoreForm({ name: store.name, address: store.address, contactPhone: store.contactPhone }); focusForm(storeFormRef.current); }}>ویرایش</button>
                  <button type="button" className="outline-btn" onClick={() => void toggleStore(store)}>{store.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}</button>
                </div>
              </article>;
            })}</div>}
    </section>

    <div className="access-grid">
      <form className="access-panel access-form" ref={userFormRef} onSubmit={createUser}>
        <div className="access-form-heading"><span>گام ۲</span><div><h3>افزودن کاربر فروشگاه</h3><p>کاربر به فروشگاه انتخاب‌شده عضو می‌شود.</p></div></div>
        {activeStores.length === 0
          ? <div className="access-callout">برای ساخت کاربر، ابتدا یک فروشگاه فعال ایجاد کنید.</div>
          : <>
            <label>فروشگاه<select required value={userForm.storeId} onChange={e => setUserForm({ ...userForm, storeId: Number(e.target.value) })}>{activeStores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}</select></label>
            <label>نام کاربری<input required minLength={3} maxLength={64} autoComplete="username" value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} /></label>
            <label>نام نمایشی<input required minLength={2} maxLength={120} autoComplete="name" value={userForm.displayName} onChange={e => setUserForm({ ...userForm, displayName: e.target.value })} /></label>
            <label>نقش<select required value={userForm.roleCode} onChange={e => setUserForm({ ...userForm, roleCode: e.target.value })}>{roles.map(role => <option key={role.code} value={role.code}>{role.name}</option>)}</select></label>
            <button className="access-primary-btn access-submit" type="submit" disabled={savingUser || !userForm.storeId || !roles.length}>{savingUser ? 'در حال ساخت کاربر…' : 'ساخت کاربر و رمز موقت'}</button>
          </>}
      </form>

      <form className="access-panel access-form" ref={storeFormRef} onSubmit={createStore}>
        <div className="access-form-heading"><span>گام ۱</span><div><h3>{editingStoreId ? 'ویرایش فروشگاه' : 'تعریف فروشگاه جدید'}</h3><p>اطلاعاتی که کاربران برای انتخاب فروشگاه می‌بینند.</p></div></div>
        <label>نام فروشگاه<input required minLength={2} maxLength={160} value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} /></label>
        <label>نشانی کامل<input required minLength={5} maxLength={300} value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} /></label>
        <label>تلفن تماس<input type="tel" maxLength={32} value={storeForm.contactPhone} onChange={e => setStoreForm({ ...storeForm, contactPhone: e.target.value })} /></label>
        <div className="access-form-actions">
          <button className="access-primary-btn access-submit" type="submit" disabled={savingStore}>{savingStore ? 'در حال ذخیره…' : editingStoreId ? 'ذخیره تغییرات' : '＋ ایجاد فروشگاه'}</button>
          {editingStoreId && <button type="button" className="outline-btn" onClick={() => { setEditingStoreId(null); setStoreForm(emptyStoreForm); }}>لغو ویرایش</button>}
        </div>
      </form>
    </div>

    {temporaryPassword && <div className="temporary-password" role="status"><b>رمز موقت — همین حالا کپی و امن منتقل کنید</b><code dir="ltr">{temporaryPassword}</code><button type="button" onClick={() => void navigator.clipboard.writeText(temporaryPassword)}>کپی رمز</button><button type="button" onClick={() => setTemporaryPassword('')}>بستن</button><small>این رمز پس از خروج از این صفحه دوباره قابل مشاهده نیست.</small></div>}

    <section className="access-panel access-list" aria-labelledby="users-heading">
      <div className="access-section-head"><div><h3 id="users-heading">کاربران فروشگاه</h3><p>حساب‌ها و وضعیت عضویت کاربران.</p></div></div>
      {loading ? <p className="access-empty" role="status">در حال دریافت کاربران…</p>
        : loadError ? <div className="access-empty access-error" role="alert">{loadError}<button type="button" className="access-secondary-btn" onClick={() => { setLoading(true); void load().catch(error => setLoadError((error as Error).message)).finally(() => setLoading(false)); }}>تلاش دوباره</button></div>
          : users.length === 0 ? <div className="access-empty">هنوز کاربری تعریف نشده است. از کارت فروشگاه، «افزودن کاربر» را بزنید.</div>
          : users.map(user => <div className="access-row" key={user.membershipId}><div><b>{user.displayName}</b><small dir="ltr">{user.username} · {stores.find(store => store.id === user.storeId)?.name ?? `#${user.storeId}`} · {user.roleName}</small></div><button type="button" className="outline-btn" onClick={() => void toggleUser(user)}>{user.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}</button><span className={`tag ${user.isActive ? 'green' : 'gray'}`}>{user.isActive ? 'فعال' : 'غیرفعال'}</span></div>)}
    </section>
  </section>;
}
