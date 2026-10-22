const format = (value) => value.toLocaleString('fa-IR');
const price = 185000000;
let quantity = 1;
let cartQuantity = 0;
let installmentCount = 4;
let paymentMode = 'installments';
let toastTimer;
const content = document.querySelector('#payment-content');
const toast = (message) => {
  clearTimeout(toastTimer);
  const target = document.querySelector('#toast');
  target.textContent = message;
  target.hidden = false;
  toastTimer = setTimeout(() => { target.hidden = true; }, 2800);
};
const focusPanel = (id) => {
  const panel = document.getElementById(id);
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  panel.classList.remove('flash');
  requestAnimationFrame(() => panel.classList.add('flash'));
};
function renderCalculator() {
  const subtotal = price * quantity;
  const fee = Math.round(subtotal * 0.07);
  const total = subtotal + fee;
  const regular = Math.ceil(total / installmentCount);
  document.querySelector('.prototype-disclaimer').hidden = paymentMode !== 'installments';
  document.querySelectorAll('[data-mode]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.mode === paymentMode)));
  if (paymentMode === 'cash') {
    content.innerHTML = `<div class="cash-value"><p>مبلغ خرید نقدی</p><strong>${format(subtotal)}</strong><small>بدون کارمزد</small><p style="margin-top:20px">تمام مبلغ بعد از تأیید پیش‌فاکتور توسط فروشنده پرداخت می‌شود.</p></div><div class="summary-total"><span>نیاز به اعتبار</span><b>ندارد</b></div>`;
    return;
  }
  if (paymentMode === 'monthly') {
    content.innerHTML = '<div class="monthly-info"><h3>اعتبار آخر ماه فعال نیست</h3><p>این روش برای حساب شما ارائه نشده است. در صورت فعال‌سازی طرح، مبلغ سررسید و تاریخ دقیق تسویه در همین بخش نمایش داده می‌شود.</p><p>فعلاً می‌توانید خرید نقدی یا اقساطی را بررسی کنید.</p></div>';
    return;
  }
  const rows = Array.from({length:installmentCount}, (_, index) => {
    const label = index === 0 ? 'بعد از تأیید فروشنده' : `${format(index)} ماه بعد از پرداخت اول`;
    const amount = index === installmentCount - 1 ? total - regular * (installmentCount - 1) : regular;
    return `<div class="schedule-row"><span>${label}</span><b>${format(amount)}</b></div>`;
  }).join('');
  content.innerHTML = `<span class="calc-label">تعداد اقساط</span><div class="count-options">${[2,3,4].map((count) => `<button data-count="${count}" aria-pressed="${count === installmentCount}">${format(count)} قسط</button>`).join('')}</div><div class="schedule">${rows}</div><div class="summary-row"><span>جمع قیمت نقدی</span><b>${format(subtotal)}</b></div><div class="summary-row"><span>کارمزد کل طرح · ۷٪</span><b>${format(fee)}</b></div><div class="summary-total"><span>جمع کل پرداخت‌ها</span><b>${format(total)}</b></div><div class="limit-note">مبلغ کالا ${format(subtotal - 150000000)} تومان بیشتر از سقف اعتبار نمایشی شماست. این محاسبه به معنی تأیید خرید اعتباری نیست.</div>`;
}
function updateQuantity() {
  document.querySelectorAll('[data-quantity]').forEach((target) => { target.textContent = format(quantity); });
  document.querySelector('#detail-total').innerHTML = `${format(price * quantity)} <small>تومان</small>`;
  document.querySelector('[data-qty="-1"]').disabled = quantity === 1;
  document.querySelector('[data-qty="1"]').disabled = quantity === 20;
  renderCalculator();
}
document.querySelectorAll('[data-qty]').forEach((button) => button.addEventListener('click', () => {
  quantity = Math.max(1, Math.min(20, quantity + Number(button.dataset.qty)));
  updateQuantity();
}));
document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
  paymentMode = button.dataset.mode;
  renderCalculator();
}));
content.addEventListener('click', (event) => {
  const button = event.target.closest('[data-count]');
  if (!button) return;
  installmentCount = Number(button.dataset.count);
  renderCalculator();
});
document.querySelectorAll('[data-calc]').forEach((button) => button.addEventListener('click', () => focusPanel('calculator-phone')));
document.querySelector('#details-open').onclick = () => focusPanel('detail-phone');
document.querySelector('#detail-back').onclick = () => focusPanel('store-phone');
document.querySelector('#calculator-close').onclick = document.querySelector('#calculator-done').onclick = () => focusPanel('detail-phone');
const menu = document.querySelector('#menu-layer');
const openMenu = () => { menu.hidden = false; document.querySelector('#menu-close').focus(); };
const closeMenu = () => { menu.hidden = true; document.querySelector('#menu-open').focus(); };
document.querySelector('#menu-open').onclick = openMenu;
document.querySelector('#menu-close').onclick = closeMenu;
document.querySelector('.scrim').onclick = closeMenu;
const panels = {
  orders:'<h3>سفارش‌ها و فاکتورها</h3><div class="order-row"><b>سفارش ۱۰۲۸ · جی تی</b><p>۱ جفت · ۱۸۵٬۰۰۰٬۰۰۰ تومان</p><small>در انتظار تأیید فروشنده</small></div><div class="order-row"><b>سفارش ۱۰۱۲ · نکسن</b><p>۲ جفت · ۱۳٬۸۰۰٬۰۰۰ تومان</p><small>تحویل‌شده · فاکتور خرید</small></div>',
  payments:'<h3>اقساط من</h3><p>قسط بعدی · ۳۰ آبان ۱۴۰۵</p><b>۳٬۶۹۱٬۵۰۰ تومان</b><p>سفارش ۱۰۱۲ · قسط ۲ از ۴</p>',
  credit:'<h3>اعتبار من</h3><p>سقف اعتبار تأییدشده</p><b>۱۵۰٬۰۰۰٬۰۰۰ تومان</b><p>اعتبار برای یک خرید است و با پرداخت قسط شارژ نمی‌شود.</p>',
  support:'<h3>مراحل خرید</h3><p>انتخاب محصول ← پیش‌فاکتور ← تأیید فروشنده ← پرداخت ← انتخاب زمان تحویل ← تأیید دریافت کالا</p>'
};
document.querySelectorAll('[data-panel]').forEach((button) => button.onclick = () => { document.querySelector('#menu-content').innerHTML = panels[button.dataset.panel]; });
document.querySelector('#active-order').onclick = () => { openMenu(); document.querySelector('#menu-content').innerHTML = panels.orders; };
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) closeMenu(); });
document.querySelector('#add-cart').onclick = () => { cartQuantity = quantity; document.querySelector('#cart-count').textContent = format(quantity); toast(`${format(quantity)} جفت به سبد نمایشی اضافه شد`); };
const cartDialog = document.querySelector('#cart-dialog');
document.querySelector('#cart-open').onclick = () => {
  document.querySelector('#cart-message').textContent = cartQuantity ? `${format(cartQuantity)} جفت جی تی · جمع قیمت نقدی ${format(cartQuantity * price)} تومان` : 'سبد خرید خالی است.';
  cartDialog.showModal();
};
document.querySelector('#cart-close').onclick = () => cartDialog.close();
document.querySelector('#cart-calc').onclick = () => { cartDialog.close(); focusPanel('calculator-phone'); };
const filterDialog = document.querySelector('#filter-dialog');
document.querySelector('#filter-open').onclick = () => filterDialog.showModal();
document.querySelector('#filter-close').onclick = () => filterDialog.close();
document.querySelector('#filter-apply').onclick = () => { filterDialog.close(); toast('فیلتر روی محصول نمایشی اعمال شد'); };
document.querySelectorAll('[data-toast]').forEach((button) => button.onclick = () => toast(button.dataset.toast));
document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const track = gallery.querySelector('.slides');
  const total = track.children.length;
  let active = 0;
  let gesture = null;
  const render = () => {
    track.style.transition = '';
    track.style.transform = `translateX(-${active * 100}%)`;
    gallery.querySelector('[data-counter]').textContent = `${format(active + 1)} / ${format(total)}`;
    gallery.querySelector('[data-prev]').disabled = active === 0;
    gallery.querySelector('[data-next]').disabled = active === total - 1;
  };
  const go = (delta) => { active = Math.max(0, Math.min(total - 1, active + delta)); render(); };
  gallery.querySelector('[data-prev]').onclick = () => go(-1);
  gallery.querySelector('[data-next]').onclick = () => go(1);
  gallery.tabIndex = 0;
  gallery.setAttribute('role', 'region');
  gallery.setAttribute('aria-label', 'گالری تصاویر محصول');
  gallery.onkeydown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(event.key === 'ArrowRight' ? 1 : -1); }
  };
  gallery.onpointerdown = (event) => {
    if (event.button !== 0 || event.target.closest('button')) return;
    gesture = {startX:event.clientX,startY:event.clientY,delta:0,horizontal:false,pointer:event.pointerId};
    gallery.setPointerCapture(event.pointerId);
  };
  gallery.onpointermove = (event) => {
    if (!gesture) return;
    const delta = event.clientX - gesture.startX;
    const vertical = event.clientY - gesture.startY;
    if (!gesture.horizontal && Math.abs(vertical) > Math.abs(delta) && Math.abs(vertical) > 8) { gesture = null; return; }
    if (Math.abs(delta) > 6) gesture.horizontal = true;
    if (!gesture.horizontal) return;
    gesture.delta = delta;
    track.style.transition = 'none';
    track.style.transform = `translateX(calc(-${active * 100}% + ${delta}px))`;
  };
  gallery.onpointerup = () => {
    if (gesture?.horizontal && Math.abs(gesture.delta) > 25) go(gesture.delta < 0 ? 1 : -1);
    else render();
    gesture = null;
  };
  gallery.onpointercancel = () => { gesture = null; render(); };
  gallery.onwheel = (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 15) {
      event.preventDefault();
      go(event.deltaX > 0 ? 1 : -1);
    }
  };
  render();
});
updateQuantity();
