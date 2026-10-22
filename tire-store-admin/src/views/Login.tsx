import { FormEvent, useState } from 'react';

export default function Login({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await onLogin(username.trim(), password);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'ورود انجام نشد. دوباره تلاش کنید.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-label="پنل مدیریت فروشگاه">
        <div className="auth-brand">
          <img className="auth-brand-logo" src="/images/sababar-logo.png" alt="لوگوی صبابار" />
          <span><b>صبابار</b><small>پنل مدیریت فروشگاه تایر</small></span>
        </div>
        <div className="auth-copy">
          <span className="auth-kicker">مدیریت یکپارچه فروشگاه</span>
          <h1>همه‌چیز برای<br />مدیریت بهتر، آماده است.</h1>
          <p>با حساب کاربری فروشگاه وارد شوید و مدیریت را از یک فضای امن ادامه دهید.</p>
        </div>
        <div className="auth-visual-foot"><span /> مدیریت فروشگاه تایر، ساده و متمرکز</div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-mobile-brand"><img src="/images/sababar-logo.png" alt="لوگوی صبابار" /> <span>پنل فروشگاه تایر</span></div>
          <span className="auth-kicker">خوش آمدید</span>
          <h2>ورود به پنل مدیریت</h2>
          <p className="auth-subtitle">نام کاربری و رمز عبور حساب خود را وارد کنید.</p>
          <form onSubmit={submit} className="auth-form">
            <label htmlFor="admin-username">نام کاربری</label>
            <input id="admin-username" name="username" autoComplete="username" value={username}
              onChange={(event) => setUsername(event.target.value)} placeholder="نام کاربری مدیر" required autoFocus />
            <label htmlFor="admin-password">رمز عبور</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" value={password}
              onChange={(event) => setPassword(event.target.value)} placeholder="رمز عبور" required />
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="auth-submit" type="submit" disabled={busy || !username || !password}>
              {busy ? 'در حال بررسی…' : 'ورود امن'}
              <span aria-hidden="true">←</span>
            </button>
          </form>
          <div className="auth-note"><span aria-hidden="true">●</span> حساب کاربری توسط مدیر کل سامانه ایجاد می‌شود.</div>
        </div>
        <footer className="auth-footer">سامانه مدیریت فروشگاه تایر <span>·</span> نسخه آزمایشی</footer>
      </section>
    </main>
  );
}
