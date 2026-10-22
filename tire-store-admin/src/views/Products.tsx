import { useCallback, useEffect, useState } from 'react';
import { productsApi, type Paged, type Product, type ProductInput } from '../lib/api';
import { useFeedback } from '../lib/feedback';
import { fa, money } from '../lib/format';
import ProductModal from './ProductModal';

const PAGE_SIZE = 10;

export default function Products() {
  const { toast } = useFeedback();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ product: Product | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [target, setTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productsApi.list(search, page, PAGE_SIZE);
      const pages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
      if (page > pages) setPage(pages);
      else setData(result);
    } catch (e) {
      toast(`${(e as Error).message} ❌`);
    } finally {
      setLoading(false);
    }
  }, [search, page, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (input: ProductInput) => {
    setSaving(true);
    try {
      const editing = modal?.product;
      if (editing) {
        await productsApi.update(editing.id, input);
        toast(`محصول «${input.brand} ${input.model}» بروزرسانی شد ✅`);
      } else {
        await productsApi.create(input);
        toast(`محصول «${input.brand} ${input.model}» با موفقیت اضافه شد ✅`);
      }
      setModal(null);
      await load();
    } catch (e) {
      toast(`${(e as Error).message} ❌`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    setDeleting(true);
    try {
      await productsApi.remove(id);
      setTarget(null);
      toast('محصول حذف شد 🗑');
      await load();
    } catch (e) {
      toast(`${(e as Error).message} ❌`);
    } finally {
      setDeleting(false);
    }
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="prod-head">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal-600)' }}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          محصولات فروشگاه
          <span className="tag teal">{fa(total)} محصول</span>
        </h2>
        <span className="ln"></span>
        <button className="add-btn" onClick={() => setModal({ product: null })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          افزودن محصول لاستیک
        </button>
      </div>

      <div className="prod-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="جستجوی برند، مدل یا سایز لاستیک…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="prod-table-wrap">
        <table className="prod-table">
          <thead>
            <tr>
              <th>برند</th>
              <th>مدل</th>
              <th>سایز</th>
              <th>قیمت جفت</th>
              <th>موجودی</th>
              <th>تصویر</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="empty-cell" colSpan={7}>
                  {loading
                    ? 'در حال بارگذاری…'
                    : search
                      ? `محصولی برای «${search}» پیدا نشد؛ عبارت جستجو را تغییر دهید.`
                      : 'هنوز محصولی به فروشگاه اضافه نشده است.'}
                </td>
              </tr>
            ) : (
              items.map((p) => {
                const badge = p.stock <= 0 ? 'none' : p.stock <= 5 ? 'low' : 'good';
                const text = p.stock <= 0 ? 'ناموجود' : p.stock <= 5 ? `کم‌موجودی · ${fa(p.stock)} عدد` : `${fa(p.stock)} عدد`;
                return (
                  <tr key={p.id}>
                    <td className="brand-name">{p.brand || '—'}</td>
                    <td className="model-name">{p.model || '—'}</td>
                    <td className="size-ltr">{p.size || '—'}</td>
                    <td className="price-cell">
                      {p.compareAtPrice > p.price ? (
                        <>
                          <span className="price-was">{money(p.compareAtPrice)}</span>
                          <span className="price-now">{money(p.price)} <small style={{ direction: 'rtl', color: 'var(--muted)', fontWeight: 700 }}>تومان</small></span>
                          <span className="price-off">{fa(Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100))}٪ تخفیف</span>
                        </>
                      ) : (
                        <>{money(p.price)} <small style={{ direction: 'rtl', color: 'var(--muted)', fontWeight: 700 }}>تومان</small></>
                      )}
                    </td>
                    <td><span className={`stock-badge ${badge}`}>{text}</span></td>
                    <td className="product-thumb-cell">
                      {p.images?.[0] ? <img className="product-thumb" src={p.images[0]} alt={`تصویر ${p.brand} ${p.model}`} loading="lazy" /> : <span className="product-thumb product-thumb-empty" aria-label="بدون تصویر">🛞</span>}
                      {p.images && p.images.length > 1 && <span className="product-thumb-count" title={`${fa(p.images.length)} تصویر محصول`}>{fa(p.images.length)}</span>}
                    </td>
                    <td>
                        <div className="prod-actions">
                          <button type="button" aria-label={`ویرایش ${p.brand} ${p.model}`} title="ویرایش" onClick={() => setModal({ product: p })}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button type="button" className="del" aria-label={`حذف ${p.brand} ${p.model}`} title="حذف" onClick={() => setTarget(p)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <nav className="pager" aria-label="صفحه‌بندی">
          <span className="pager-info">نمایش {fa((page - 1) * PAGE_SIZE + 1)} تا {fa(Math.min(page * PAGE_SIZE, total))} از {fa(total)} محصول</span>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>قبلی</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === page ? 'on' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => setPage(n)}>
              {fa(n)}
            </button>
          ))}
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>بعدی</button>
        </nav>
      )}

      {target && (
        <div className="overlay show" style={{ zIndex: 60 }} onClick={(e) => e.target === e.currentTarget && !deleting && setTarget(null)}>
          <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="delTitle">
            <h3 id="delTitle">حذف محصول</h3>
            <p className="msub">آیا از حذف این محصول مطمئن هستید؟ این کار قابل بازگشت نیست و محصول از فروشگاه راننده‌ها هم برداشته می‌شود.</p>
            <div className="oinfo">
              <span>{target.brand} {target.model}</span>
              <span style={{ direction: 'ltr' }}>{target.size}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn ghost" disabled={deleting} onClick={() => setTarget(null)}>انصراف</button>
              <button type="button" className="btn primary" style={{ background: 'var(--pink)', boxShadow: 'none' }} disabled={deleting} onClick={() => void remove(target.id)}>
                {deleting ? 'در حال حذف…' : 'بله، حذف شود'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && <ProductModal product={modal.product} saving={saving} onClose={() => setModal(null)} onSave={(i) => void save(i)} />}
    </>
  );
}
