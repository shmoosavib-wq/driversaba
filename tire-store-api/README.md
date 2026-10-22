# صبابار Tire Store API (.NET 8، Clean Architecture)

## ساختار
- `src/TireStore.Domain` – موجودیت‌ها (Product, Shop, Order, ...)
- `src/TireStore.Application` – سرویس‌ها، DTOها و interfaceهای repository
- `src/TireStore.Infrastructure` – EF Core و SQLite برای فروشگاه‌ها، محصولات و موجودی؛ اعتبار/سفارش فعلاً in-memory
- `src/TireStore.Api` – Minimal API، احراز هویت و مجوزهای پنل

## اجرا
```powershell
cd tire-store-api
dotnet run --project src/TireStore.Api --urls http://localhost:5188
```
پایگاه داده‌ی مستقل SQLite به‌صورت خودکار در `src/TireStore.Api/App_Data/tire-store.db` ساخته می‌شود. سه فروشگاه و سه محصول نمونه در اولین اجرا seed می‌شوند. محصولات، عکس‌ها و موجودی هر فروشگاه پس از ری‌استارت باقی می‌مانند.

ساختار کاتالوگ:
- `Stores`: فروشگاه‌های فروشنده.
- `Products`: مشخصات و اطلاعات فنی محصول.
- `StoreInventory`: قیمت جفت، قیمت قبل از تخفیف و موجودی وابسته به فروشگاه با کلید مرکب `(StoreId, ProductId)`.
- پنل ادمین محصولات و موجودی را در فروشگاه انتخاب‌شده مدیریت می‌کند؛ اپ موجودی را برای `shopId` انتخاب‌شده از همان API دریافت می‌کند.

## تخفیف و فروش ویژه
- دو فیلد مستقل در `StoreInventory` نگهداری می‌شود: `Price` (قیمت فروش و مبنای همه‌ی محاسبات سفارش/اقساط) و `CompareAtPrice` (قیمت قبل از تخفیف، فقط برای نمایش).
- تخفیف زمانی فعال است که `CompareAtPrice > Price` باشد. درصد تخفیف همیشه از همین دو مقدار مشتق می‌شود و در سرور اعتبارسنجی می‌شود (کمینه ۵٪، بیشینه ۷۰٪؛ مقدار بزرگ‌تر از قیمت فروش و غیرمنفی).
- `CompareAtPrice` هیچ‌گاه در محاسبه‌ی مبلغ سفارش استفاده نمی‌شود؛ `OrderService` همیشه از `Price` استفاده می‌کند.
- در اپ راننده، کارت و صفحه‌ی جزئیات محصول قیمت خط‌خورده، قیمت نهایی، درصد تخفیف و مبلغ صرفه‌جویی را نشان می‌دهد. بج بر اساس درصد انتخاب می‌شود: زیر ۵٪ بدون بج، ۵ تا ۹٪ بج ساده، ۱۰ تا ۲۹٪ بج تخفیف، ۳۰٪ و بالاتر بج «فروش ویژه».

## هویت و راه‌اندازی مدیر کل
- هویت پنل مستقل از ERP است. مدیر کل اولیه را فقط یک‌بار و در ترمینال توسعه اجرا کنید:
  ```powershell
  dotnet run --project src/TireStore.Api -- --bootstrap-super-admin
  ```
- نام کاربری، نام نمایشی و رمز قوی (حداقل ۱۲ نویسه) را وارد کنید. رمز در صفحه نمایش داده نمی‌شود. اجرای دوباره‌ی bootstrap پس از ساخته‌شدن مدیر کل رد می‌شود.
- ورود پنل از `http://localhost:5173` انجام می‌شود. نشست با کوکی `HttpOnly` و درخواست‌های تغییردهنده با CSRF token محافظت می‌شوند؛ محیط Production به HTTPS نیاز دارد.
- مدیر کل می‌تواند فروشگاه ایجاد/ویرایش/غیرفعال کند و کاربران فروشگاه را با نقش `مدیر فروشگاه` یا `اپراتور` بسازد. رمز موقت فقط یک‌بار نمایش داده می‌شود و کاربر پیش از ورود به بخش‌های پنل مجبور به تغییر آن است.
- مجوزها با شناسه‌ی ثابت در `StoreAdminPermissions` ثبت و به نقش‌های پلتفرم/فروشگاهی تخصیص داده می‌شوند. هر endpoint مدیریتی مجوز را سمت سرور بررسی می‌کند؛ شناسه فروشگاه هم از عضویت کاربر اعتبارسنجی می‌شود. دسترسی‌ها فعلاً قابل‌تخصیص در سطح اکشن در مدل داده هستند، اما UI ویرایش مجوزها هنوز در این فاز ساخته نشده است.
- در Development، محصولات/موجودی و هویت فروشگاه در SQLite محلی پایدارند؛ برای استقرار از SQL Server استفاده می‌شود. سفارش، اعتبار و اقساط همچنان وضعیت قبلی این نسخه را دارند و این کار بخش مالی را پیاده‌سازی نمی‌کند.

## SQL Server و استقرار
- در `Development`، SQLite محلی با `ConnectionStrings:StoreDatabase` استفاده می‌شود. خارج از Development، provider پیش‌فرض SQL Server است و مقدار `ConnectionStrings__StoreSqlServer` باید از secret store محیط اجرا تزریق شود.
- مایگریشن اولیه‌ی SQL Server در `src/TireStore.Infrastructure/Migrations` اسکیمای کاتالوگ، موجودی و دسترسی پنل را ایجاد می‌کند. پیش از اجرای API، آن را یک‌بار با `dotnet run --project src/TireStore.Api -- --migrate-store-database` اعمال کنید.
- API در شروع عادی اسکیمای SQL Server را تغییر نمی‌دهد و اگر مایگریشن اعمال‌نشده وجود داشته باشد، از اجرا خودداری می‌کند. دیتای SQLite موجود به‌صورت خودکار منتقل نمی‌شود؛ انتقال باید جداگانه و پس از بررسی انجام شود.
- `GET /api/store/capabilities` خارج از Development مقدار `commerceEnabled: false` می‌دهد. در این محیط‌ها فقط خواندن فروشگاه/محصول و مدیریت احراز‌شده‌ی محصول/دسترسی map شده؛ مسیرهای اعتبار، سفارش، اقساط و پرداخت در دسترس نیستند.
- سفارش‌ها، اقساط و اعتبار هنوز در حافظه‌اند و با ری‌استارت پاک می‌شوند؛ انتقال آن‌ها و اتصال هویت راننده به ERP پیش‌نیاز انتشار عملیاتی است.

## پرداخت تومن
- در `Development` حالت پیش‌فرض `TomanPayment:Mode=Mock` است. پس از انتخاب «ورود به درگاه»، صفحه‌ی تست موفق/انصراف باز می‌شود؛ هیچ پول واقعی جابه‌جا نمی‌شود.
- برای محیط تست واقعی تومن، `TomanPayment:Mode` را روی `Toman` بگذار و مقادیر `TomanPayment__ClientId`، `TomanPayment__ClientSecret`، `TomanPayment__Username` و `TomanPayment__Password` را از تومن به‌صورت Environment Variable تنظیم کن؛ اطلاعات محرمانه را در فایل تنظیمات یا مخزن کد قرار نده.
- آدرس callback باید عمومی و از قبل در تومن ثبت شده باشد: `https://<دامنه-ثبت‌شده>/api/store/payments/toman/callback`. برای تست روی لوکال، API باید از طریق دامنه/تونل ثبت‌شده در دسترس تومن باشد. آدرس بازگشت اپ با `TomanPayment__FrontendReturnUrl` تنظیم می‌شود.
- بک‌اند مبلغ را از قسط محاسبه می‌کند، به ریال تبدیل می‌کند و فقط پس از تطبیق callback و پاسخ موفق `verify` پرداخت را ثبت می‌کند. نتیجه‌ی نامشخص پرداخت برای جلوگیری از پرداخت دوباره در وضعیت بررسی نگه داشته می‌شود.
- توجه: سفارش‌ها و اقساط این نسخه هنوز in-memory هستند؛ برای پرداخت واقعی/عملیاتی باید ابتدا آن‌ها به دیتابیس منتقل و دسترسی کاربر/مالکیت سفارش نیز اعمال شود.

## مسیرها
- پنل ادمین: `/api/admin/auth/*`، `/api/admin/access/*` و `/api/admin/products` در تمام محیط‌ها؛ `/api/admin/orders` فقط در Development map می‌شود.
- اپ راننده: `/api/store/capabilities`، `/api/store/shops` و `/api/store/products` در تمام محیط‌ها؛ مسیرهای `/api/store/credit`, `/orders` و `/installments` فقط در Development map می‌شوند.
- فهرست محصولات پنل با `shopId`, `q`, `page`, `pageSize` محدود می‌شود.
- `GET /health`
- `GET /health/ready` checks database connectivity and pending SQL Server migrations; it returns `503` when the service should not receive traffic.

### Production browser origins

- Outside `Development`, set `Cors__Origins` to the exact HTTPS driver-app and admin-panel origins (scheme and host only, no path). The base `appsettings.json` intentionally contains an empty origin list, and the API fails startup when no origins are configured or an invalid/insecure origin is supplied.
- Development continues to use the local origins configured by the API startup defaults.
