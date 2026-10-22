import { useState, type FormEvent } from 'react';

export default function ChangePassword({ onChange, onLogout }: { onChange: (current: string, next: string) => Promise<void>; onLogout: () => Promise<void> }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (next.length < 8) { setError('رمز جدید باید حداقل ۸ کاراکتر باشد.'); return; }
    if (next !== confirm) { setError('تکرار رمز جدید یکسان نیست.'); return; }
    setSaving(true);
    try { await onChange(current, next); } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  };
  return <main className="login-page" dir="rtl"><form className="login-card" onSubmit={event => void submit(event)}>
    <div className="login-brand">امنیت حساب</div><h1>رمز موقت را تغییر دهید</h1><p>برای ادامه به پنل، یک رمز شخصی با حداقل ۸ کاراکتر انتخاب کنید.</p>
    <label>رمز موقت فعلی<input required autoComplete="current-password" type="password" value={current} onChange={e => setCurrent(e.target.value)} /></label>
    <label>رمز جدید<input required minLength={8} autoComplete="new-password" type="password" value={next} onChange={e => setNext(e.target.value)} /></label>
    <label>تکرار رمز جدید<input required minLength={8} autoComplete="new-password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
    {error && <div className="login-error" role="alert">{error}</div>}
    <button className="login-submit" disabled={saving}>{saving ? 'در حال ذخیره…' : 'ثبت رمز جدید'}</button>
    <button className="change-password-logout" type="button" onClick={() => void onLogout()}>خروج</button>
  </form></main>;
}
