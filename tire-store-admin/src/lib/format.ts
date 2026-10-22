const FD = '۰۱۲۳۴۵۶۷۸۹';

export const fa = (value: string | number): string => String(value).replace(/\d/g, (d) => FD[Number(d)]);

export const money = (n: number): string => n.toLocaleString('fa-IR');

export const toLatinDigits = (value: string): string =>
  value
    .replace(/[۰-۹]/g, (d) => String(FD.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

export const parsePrice = (value: string): number => Number(toLatinDigits(value).replace(/[^\d]/g, '')) || 0;

export const formatPriceInput = (value: string): string => {
  const digits = parsePrice(value);
  return digits ? digits.toLocaleString('fa-IR') : '';
};

export const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export type JDate = [number, number, number];

export function g2j(gy: number, gm: number, gd: number): JDate {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + gdm[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  return [jy, jm, 1 + (days < 186 ? days % 31 : (days - 186) % 30)];
}

export const addDaysJ = (n: number): JDate => {
  const d = new Date(Date.now() + n * 864e5);
  return g2j(d.getFullYear(), d.getMonth() + 1, d.getDate());
};

export const jShort = (d: JDate): string => `${fa(d[2])} ${MONTHS[d[1] - 1]}`;
export const jFull = (d: JDate): string => `${fa(d[2])} ${MONTHS[d[1] - 1]} ${fa(d[0])}`;

export const dayDiff = (d: JDate): number => {
  const now = addDaysJ(0);
  const toDate = (j: JDate) => new Date(j[0], j[1] - 1, j[2]).getTime();
  return Math.round((toDate(d) - toDate(now)) / 864e5);
};
