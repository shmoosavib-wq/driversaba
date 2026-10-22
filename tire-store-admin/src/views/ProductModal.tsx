import { useEffect, useRef, useState } from 'react';
import { useFeedback } from '../lib/feedback';
import { formatPriceInput, parsePrice, toLatinDigits } from '../lib/format';
import { productsApi, type Product, type ProductBrand, type ProductInput } from '../lib/api';

const COUNTRIES = ['چین', 'تایوان', 'ایران', 'کره جنوبی', 'تایلند', 'اندونزی'];
const MAX_IMAGES = 6;
const MAX_BYTES = 3 * 1024 * 1024;

interface Form {
  brand: string;
  model: string;
  size: string;
  width: string;
  profile: string;
  rim: string;
  pattern: string;
  axlePosition: string;
  loadIndex: string;
  year: string;
  country: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  description: string;
}

const toForm = (p?: Product): Form => ({
  brand: p?.brand ?? '',
  model: p?.model ?? '',
  size: p?.size ?? '',
  width: p?.width ? String(p.width) : '',
  profile: p?.profile ? String(p.profile) : '',
  rim: p?.rim ?? '',
  pattern: p?.pattern ?? '',
  axlePosition: p?.axlePosition ?? '',
  loadIndex: p?.loadIndex ?? '',
  year: p?.year ? String(p.year) : '',
  country: p?.country ?? '',
  price: p?.price ? formatPriceInput(String(p.price)) : '',
  compareAtPrice: p?.compareAtPrice ? formatPriceInput(String(p.compareAtPrice)) : '',
  stock: p?.stock ? String(p.stock) : '',
  description: p?.description ?? '',
});

const int = (v: string) => parseInt(toLatinDigits(v), 10) || 0;

interface Props {
  product: Product | null;
  saving: boolean;
  onClose: () => void;
  onSave: (input: ProductInput) => void;
}

export default function ProductModal({ product, saving, onClose, onSave }: Props) {
  const { toast } = useFeedback();
  const [form, setForm] = useState<Form>(() => toForm(product ?? undefined));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const file = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLSelectElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    brandRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let active = true;
    void productsApi.brands().then((items) => {
      if (active) setBrands(items);
    }).catch((error: Error) => {
      if (active) toast(`بارگذاری فهرست برندها انجام نشد: ${error.message}`);
    });
    return () => { active = false; };
  }, [toast]);

  const set = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e.has(key)) return e;
      const next = new Set(e);
      next.delete(key);
      return next;
    });
  };
  const cls = (key: string, extra = '') => `${extra}${errors.has(key) ? ' err-field' : ''}`.trim() || undefined;
  const ltr = { direction: 'ltr' as const, textAlign: 'right' as const };

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const room = MAX_IMAGES - images.length;
    if (room <= 0) return toast(`حداکثر ${MAX_IMAGES} عکس می‌تونی اضافه کنی ❌`);
    const added: string[] = [];
    for (const f of Array.from(files).slice(0, room)) {
      if (!f.type.startsWith('image/')) {
        toast('فقط فایل تصویری قابل قبوله ❌');
        continue;
      }
      if (f.size > MAX_BYTES) {
        toast('حجم هر عکس نباید بیشتر از ۳ مگابایت باشه ❌');
        continue;
      }
      added.push(
        await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(f);
        }),
      );
    }
    if (added.length) setImages((list) => [...list, ...added]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parsePrice(form.price);
    const compareAtPrice = parsePrice(form.compareAtPrice);
    const missing = (['brand', 'model', 'size', 'country'] as const).filter((k) => !form[k].trim());
    if (!price) missing.push('price' as never);
    if (missing.length) {
      setErrors(new Set(missing));
      toast('برند، مدل، سایز، کشور تولیدکننده و قیمت رو کامل وارد کن ❌');
      return;
    }
    if (compareAtPrice) {
      if (compareAtPrice <= price) {
        setErrors(new Set(['compareAtPrice']));
        toast('قیمت قبل از تخفیف باید بیشتر از قیمت فروش باشه ❌');
        return;
      }
      const percent = ((compareAtPrice - price) / compareAtPrice) * 100;
      if (percent < 5 || percent > 70) {
        setErrors(new Set(['compareAtPrice']));
        toast('درصد تخفیف باید بین ۵٪ تا ۷۰٪ باشه ❌');
        return;
      }
    }
    let width = int(form.width);
    let profile = int(form.profile);
    let rim = form.rim.trim();
    const match = form.size.trim().match(/^(\d+)\/(\d+)(R?\d+)$/i);
    if (match) {
      width ||= parseInt(match[1], 10);
      profile ||= parseInt(match[2], 10);
      rim ||= /^r/i.test(match[3]) ? match[3] : `R${match[3]}`;
    }
    onSave({
      brand: form.brand.trim(),
      model: form.model.trim(),
      size: form.size.trim(),
      width,
      profile,
      rim,
      pattern: form.pattern.trim(),
      axlePosition: form.axlePosition.trim(),
      loadIndex: form.loadIndex.trim(),
      year: int(form.year),
      country: form.country.trim(),
      warranty: '',
      warrantyMonths: 0,
      price,
      compareAtPrice,
      stock: int(form.stock),
      description: form.description.trim(),
      images,
    });
  };

  return (
    <div className="overlay prod show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pmodal">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal-600)' }}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span>{product ? 'ویرایش محصول' : 'افزودن محصول لاستیک'}</span>
          <span className="ln"></span>
          <span className="tag teal">{product ? `ویرایش · ${product.brand}` : 'محصول جدید'}</span>
        </h3>
        <p className="msub">مشخصات فنی لاستیک رو کامل وارد کن. عکس و توضیحات محصول برای راننده‌ها نمایش داده می‌شه.</p>

        <form className="pform" id="prodForm" autoComplete="off" onSubmit={submit}>
          <div className="img-upload multi">
            <div className="iinfo">
              <b>عکس‌های محصول</b>
              <small>
                چند عکس واقعی از لاستیک آپلود کن (JPG/PNG، هر کدام حداکثر ۳ مگ، تا {MAX_IMAGES} عکس). عکس اول به‌عنوان تصویر اصلی نمایش داده می‌شه.
              </small>
            </div>
            <div className="thumbs">
              {images.map((src, i) => (
                <div className="thumb" key={i}>
                  <img src={src} alt="" />
                  {i === 0 && <span className="main">اصلی</span>}
                  <button type="button" aria-label="حذف عکس" onClick={() => setImages((l) => l.filter((_, j) => j !== i))}>
                    ×
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button type="button" className="thumb add" onClick={() => file.current?.click()}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <small>افزودن عکس</small>
                </button>
              )}
            </div>
            <input
              ref={file}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                void addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>

          <div className="fg">
            <label>برند <span className="req">*</span></label>
            <select ref={brandRef} className={cls('brand')} value={brands.some((brand) => brand.nameFa === form.brand || brand.nameEn === form.brand) ? brands.find((brand) => brand.nameFa === form.brand || brand.nameEn === form.brand)?.nameFa : form.brand} onChange={(e) => set('brand', e.target.value)}>
              <option value="" disabled>{brands.length ? 'انتخاب برند' : 'در حال بارگذاری برندها…'}</option>
              {form.brand && !brands.some((brand) => brand.nameFa === form.brand || brand.nameEn === form.brand) && <option value={form.brand}>{form.brand} · برند ثبت‌شده قبلی</option>}
              {brands.map((brand) => <option key={brand.id} value={brand.nameFa}>{brand.nameFa} — {brand.nameEn}</option>)}
            </select>
          </div>
          <div className="fg">
            <label>مدل <span className="req">*</span></label>
            <input className={cls('model')} maxLength={160} placeholder="مثلاً CROSS SPORT SP-9" value={form.model} onChange={(e) => set('model', e.target.value)} />
          </div>

          <div className="fg full">
            <label>
              سایز کامل لاستیک <span className="req">*</span> <small style={{ color: 'var(--muted)', fontWeight: 700 }}>(مثلاً 185/65R14)</small>
            </label>
            <input className={cls('size', 'ltr')} style={ltr} maxLength={40} placeholder="185/65R14" value={form.size} onChange={(e) => set('size', e.target.value)} />
          </div>
          <div className="fg full">
            <label>اجزای سایز</label>
            <div className="size-row">
              <div className="fg" style={{ gap: 4 }}>
                <label style={{ fontSize: 10.5 }}>پهنا (mm)</label>
                <input inputMode="numeric" style={ltr} placeholder="185" value={form.width} onChange={(e) => set('width', e.target.value)} />
              </div>
              <div className="fg" style={{ gap: 4 }}>
                <label style={{ fontSize: 10.5 }}>فاق (%)</label>
                <input inputMode="numeric" style={ltr} placeholder="65" value={form.profile} onChange={(e) => set('profile', e.target.value)} />
              </div>
              <div className="fg" style={{ gap: 4 }}>
                <label style={{ fontSize: 10.5 }}>قطر رینگ</label>
                <input style={ltr} placeholder="R14" value={form.rim} onChange={(e) => set('rim', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="fg">
            <label>پترن / طرح آج</label>
            <input style={ltr} placeholder="مثلاً np226" value={form.pattern} onChange={(e) => set('pattern', e.target.value)} />
          </div>
          <div className="fg">
            <label>محور مصرف</label>
            <select value={form.axlePosition} onChange={(e) => set('axlePosition', e.target.value)}>
              <option value="">انتخاب اختیاری</option>
              <option value="فرمان">فرمان</option>
              <option value="محرک / دیفرانسیل">محرک / دیفرانسیل</option>
              <option value="تریلر">تریلر</option>
              <option value="همه‌محورها">همه‌محورها</option>
            </select>
          </div>
          <div className="fg">
            <label>شاخص وزن و سرعت</label>
            <input style={ltr} placeholder="مثلاً 104V XL" value={form.loadIndex} onChange={(e) => set('loadIndex', e.target.value)} />
          </div>

          <div className="fg">
            <label>سال ساخت</label>
            <input inputMode="numeric" style={ltr} placeholder="2026" value={form.year} onChange={(e) => set('year', e.target.value)} />
          </div>
          <div className="fg">
            <label>کشور تولیدکننده <span className="req">*</span></label>
            <input className={cls('country')} list="countryList" placeholder="انتخاب یا واردکردن کشور" value={form.country} onChange={(e) => set('country', e.target.value)} />
            <datalist id="countryList">{COUNTRIES.map((c) => <option key={c} value={c} />)}</datalist>
          </div>

          <div className="fg">
            <label>قیمت جفت (تومان) <span className="req">*</span></label>
            <input
              className={cls('price')}
              inputMode="numeric"
              style={ltr}
              placeholder="مثلاً ۴٬۵۰۰٬۰۰۰"
              value={form.price}
              onChange={(e) => set('price', formatPriceInput(e.target.value))}
            />
          </div>
          <div className="fg">
            <label>قیمت قبل از تخفیف (اختیاری)</label>
            <input
              className={cls('compareAtPrice')}
              inputMode="numeric"
              style={ltr}
              placeholder="در صورت داشتن تخفیف وارد کنید"
              value={form.compareAtPrice}
              onChange={(e) => set('compareAtPrice', formatPriceInput(e.target.value))}
            />
            <small style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 10.5 }}>
              اگر پر شود، قیمت خط‌خورده و تگ تخفیف روی کارت محصول نمایش داده می‌شود؛ خالی بگذارید تا بدون تخفیف باشد.
            </small>
          </div>
          <div className="fg">
            <label>موجودی (تعداد)</label>
            <input inputMode="numeric" style={ltr} placeholder="مثلاً 24" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
          </div>

          <div className="fg full">
            <label>توضیحات محصول</label>
            <textarea placeholder="ویژگی‌ها، کاربرد، نوع خودرو و… رو این‌جا بنویس." value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div className="pfoot full">
            <span className="phint">
              {product ? 'تغییرات ذخیره و در فروشگاه بروزرسانی می‌شه.' : 'برای انتشار محصول در فروشگاه، حداقل برند، مدل، سایز و قیمت لازمه.'}
            </span>
            <div className="pacts">
              <button type="button" className="btn ghost" style={{ flex: '0 0 auto', padding: '0 18px' }} onClick={onClose}>
                انصراف
              </button>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'در حال ذخیره…' : 'ذخیره محصول'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
