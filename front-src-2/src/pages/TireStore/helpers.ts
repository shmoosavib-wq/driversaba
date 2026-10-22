export const toman = (n: number) => Math.round(n).toLocaleString("fa-IR");
export const fa = (n: number) => n.toLocaleString("fa-IR");
export const installmentAmount = (price: number, count: number, feeRate: number) =>
  Math.ceil((price * (1 + feeRate)) / count);
export const fleetId = (fleet: any) => fleet?.TransportEquipmentId || fleet?.EquipmentId || fleet?.Id || fleet?.id || 0;
export const fleetName = (fleet: any) => fleet?.VehicleType?.label || fleet?.VehicleType || fleet?.EquipmentType || fleet?.Name || "ناوگان صبابار";
export const fleetPlate = (fleet: any) => fleet?.PlateNumber || fleet?.LicensePlate || fleet?.EquipmentSmartNumber || fleet?.SmartNumber || "پلاک ثبت‌شده";

const JALALI_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

const toJalali = (gy: number, gm: number, gd: number) => {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 355666 + 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + gdm[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
};

export const jalaliDate = (value: string | Date) => {
  const date = new Date(value);
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((part) => [part.type, part.value]));
  const { jy, jm, jd } = toJalali(Number(parts.year), Number(parts.month), Number(parts.day));
  return `${jd.toLocaleString("fa-IR")} ${JALALI_MONTHS[jm - 1]} ${jy.toLocaleString("fa-IR", { useGrouping: false })}`;
};

export const jalaliDateTime = (value: string | Date) => new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
}).format(new Date(value));
