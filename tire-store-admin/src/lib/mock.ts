import { addDaysJ, type JDate } from './format';

export type OrderStatus = 'pending' | 'waitingPayment' | 'approved' | 'awaitingDriver' | 'delivered' | 'settled' | 'rejected';

export interface OrderItem {
  b: string;
  s: string;
  q: number;
  p: number;
}

export interface Order {
  id: string;
  no: string;
  driver: string;
  fleet: string;
  plate: [string, string];
  truck: string;
  dAgo: number;
  fromApp: boolean;
  items: OrderItem[];
  total: number;
  down: number;
  fin: number;
  status: OrderStatus;
  code: string;
  settleDate?: JDate;
  ref?: string;
  settleJ?: JDate;
  apiId?: number;
  apiStatus?: string;
  paymentMode?: string;
  createdAt?: string;
  isDemo?: boolean;
}

export const STATUS_META: Record<OrderStatus, { t: string; c: string }> = {
  pending: { t: 'در انتظار تأیید', c: 'amber' },
  waitingPayment: { t: 'در انتظار پرداخت راننده', c: 'amber' },
  approved: { t: 'آماده تحویل', c: 'teal' },
  awaitingDriver: { t: 'در انتظار تأیید راننده', c: 'violet' },
  delivered: { t: 'در انتظار تسویه', c: 'violet' },
  settled: { t: 'تسویه‌شده', c: 'green' },
  rejected: { t: 'رد شده', c: 'amber' },
};

export const createMockOrders = (): Order[] => {
  const orders: Order[] = [
  { id: 'o1', no: 'PF-1404-1042', driver: 'سیدحمید موسوی بیوکی', fleet: 'ناوگان باربری تابش', plate: ['۵۵۶ ب ۵۵', '۲۲'], truck: 'تریلی کفی', dAgo: 0, fromApp: true,
    items: [{ b: 'گلکسی MFS101', s: '315/80R22.5', q: 2, p: 14000000 }, { b: 'نکسن SB202', s: '275/70R22.5', q: 1, p: 6900000 }],
    total: 34900000, down: 3490000, fin: 31410000, status: 'pending', code: 'K7M2T' },
  { id: 'o8', no: 'PF-1404-1043', driver: 'رضا قاسمی', fleet: 'ناوگان باربری پارس', plate: ['۷۳ و ۲۱', '۱۱'], truck: 'کمپرسی', dAgo: 0, fromApp: false,
    items: [{ b: 'گلکسی MFS101', s: '315/80R22.5', q: 1, p: 14000000 }, { b: 'چائویانگ CR602', s: '295/80R22.5', q: 2, p: 9900000 }],
    total: 33800000, down: 0, fin: 33800000, status: 'pending', code: 'P5W9D' },
  { id: 'o2', no: 'PF-1404-1039', driver: 'محمود کریمی', fleet: 'ناوگان باربری پارس', plate: ['۴۴ ع ۷۸', '۱۱'], truck: 'کمپرسی', dAgo: 0, fromApp: false,
    items: [{ b: 'تایرون 704', s: '3.00R15', q: 2, p: 14000000 }],
    total: 28000000, down: 5600000, fin: 22400000, status: 'approved', code: 'R4N8X' },
  { id: 'o3', no: 'PF-1404-1035', driver: 'حسین احمدی', fleet: 'ناوگان باربری تابش', plate: ['۳۱ ط ۱۲', '۲۲'], truck: 'تریلی یخچالی', dAgo: 1, fromApp: false,
    items: [{ b: 'نکسن SB202', s: '275/70R22.5', q: 6, p: 6900000 }],
    total: 41400000, down: 0, fin: 41400000, status: 'delivered', settleDate: addDaysJ(1), code: 'B9Q3Z' },
  { id: 'o4', no: 'PF-1404-1031', driver: 'علی رضایی', fleet: 'ناوگان باربری پارس', plate: ['۸۶ س ۴۴', '۹۳'], truck: 'کشنده', dAgo: 3, fromApp: false,
    items: [{ b: 'چائویانگ CR602', s: '295/80R22.5', q: 4, p: 9900000 }],
    total: 39600000, down: 0, fin: 39600000, status: 'settled', ref: 'TR-88123', settleJ: addDaysJ(-1), code: 'C2H6L' },
  { id: 'o5', no: 'PF-1404-1028', driver: 'مجتبی نوری', fleet: 'ناوگان باربری تابش', plate: ['۲۲ د ۹۰', '۲۲'], truck: 'ایسوزو', dAgo: 2, fromApp: false,
    items: [{ b: 'گلکسی MFS101', s: '315/80R22.5', q: 1, p: 14000000 }, { b: 'تایرون 704', s: '3.00R15', q: 1, p: 14000000 }],
    total: 28000000, down: 2000000, fin: 26000000, status: 'settled', ref: 'TR-88097', settleJ: addDaysJ(0), code: 'D8J4M' },
  { id: 'o6', no: 'PF-1404-1022', driver: 'رضا شریفی', fleet: 'ناوگان آریا', plate: ['۶۷ م ۳۳', '۵۱'], truck: 'تک', dAgo: 5, fromApp: false,
    items: [{ b: 'نکسن SB202', s: '275/70R22.5', q: 2, p: 6900000 }, { b: 'چائویانگ CR602', s: '295/80R22.5', q: 1, p: 9900000 }],
    total: 23700000, down: 0, fin: 23700000, status: 'settled', ref: 'TR-88041', settleJ: addDaysJ(-3), code: 'E3K7R' },
  { id: 'o7', no: 'PF-1404-1019', driver: 'کاظم مرادی', fleet: 'ناوگان باربری تابش', plate: ['۱۹ ب ۵۵', '۲۲'], truck: 'تریلی کفی', dAgo: 6, fromApp: false,
    items: [{ b: 'تایرون 704', s: '3.00R15', q: 1, p: 14000000 }],
    total: 14000000, down: 0, fin: 14000000, status: 'settled', ref: 'TR-88012', settleJ: addDaysJ(-4), code: 'F9P2N' },
  { id: 'o9', no: 'PF-1404-1015', driver: 'سعید محمدی', fleet: 'ناوگان نمونه', plate: ['۲۱ الف ۴۵', '۲۲'], truck: 'کامیون باری', dAgo: 7, fromApp: false,
    items: [{ b: 'نکسن SB202', s: '275/70R22.5', q: 2, p: 6900000 }],
    total: 13800000, down: 0, fin: 13800000, status: 'rejected', code: 'H2L6Q' },
  { id: 'o10', no: 'PF-1404-1012', driver: 'راننده نمونه', fleet: 'ناوگان نمونه پرداخت', plate: ['۴۵ ج ۶۷۸', '۱۱'], truck: 'کامیونت باری', dAgo: 8, fromApp: true,
    items: [{ b: 'گلکسی MFS101', s: '315/80R22.5', q: 1, p: 14000000 }],
    total: 14980000, down: 0, fin: 14980000, status: 'waitingPayment', code: '' },
  { id: 'o11', no: 'PF-1404-1010', driver: 'راننده نمونه', fleet: 'ناوگان نمونه تحویل', plate: ['۱۲ ب ۳۴۵', '۶۸'], truck: 'لیفتراک ۳ تنی', dAgo: 9, fromApp: true,
    items: [{ b: 'نکسن SB202', s: '275/70R22.5', q: 1, p: 6900000 }],
    total: 7383000, down: 0, fin: 7383000, status: 'awaitingDriver', code: 'T6Y8P' },
  ];

  const now = Date.now();
  return orders.map((order, index) => ({
    ...order,
    createdAt: new Date(now - (order.dAgo * 24 + index) * 60 * 60 * 1000).toISOString(),
  }));
};

const ACTIVE: OrderStatus[] = ['approved', 'delivered', 'settled'];

export const calc = (orders: Order[]) => {
  const confirmed = orders.filter((o) => ACTIVE.includes(o.status));
  const today = confirmed.filter((o) => o.dAgo === 0);
  const delivered = orders.filter((o) => o.status === 'delivered');
  const settled = orders.filter((o) => o.status === 'settled');
  const sum = (list: Order[], pick: (o: Order) => number) => list.reduce((s, o) => s + pick(o), 0);
  return {
    total: sum(confirmed, (o) => o.total),
    totalN: confirmed.length,
    today: sum(today, (o) => o.total),
    todayN: today.length,
    debt: sum(delivered, (o) => o.fin),
    debtN: delivered.length,
    settled: sum(settled, (o) => o.fin),
    settledN: settled.length,
    cash: sum(orders.filter((o) => o.status === 'delivered' || o.status === 'settled'), (o) => o.down),
    pendingN: orders.filter((o) => o.status === 'pending').length,
  };
};
