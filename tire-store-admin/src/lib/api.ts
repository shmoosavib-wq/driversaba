const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5188';
let csrfToken = '';
let activeStoreId: number | null = null;
export const setActiveStoreId = (id: number | null) => { activeStoreId = id; };
const storeQuery = () => activeStoreId ? `shopId=${activeStoreId}` : '';

export interface AdminSession {
  userId: string;
  username: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  storeIds: number[];
  mustChangePassword: boolean;
}

export interface Product {
  id: number;
  brand: string;
  model: string;
  size: string;
  width: number;
  profile: number;
  rim: string;
  pattern: string;
  axlePosition: string;
  loadIndex: string;
  noise: string;
  year: number;
  country: string;
  warranty: string;
  warrantyMonths: number;
  price: number;
  compareAtPrice: number;
  stock: number;
  description: string;
  images: string[];
}

export interface ProductBrand {
  id: number;
  nameFa: string;
  nameEn: string;
}

export type ProductInput = Omit<Product, 'id' | 'noise'>;

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StoreSummary {
  id: number;
  name: string;
  address: string;
  productCount: number;
}
export interface ManagedStore extends StoreSummary { contactPhone: string; isActive: boolean; }
export interface StoreUser { membershipId: number; userId: string; storeId: number; username: string; displayName: string; roleCode: string; roleName: string; isActive: boolean; createdAt: string; }
export interface StoreRole { code: string; name: string; }

export interface StoreOrder {
  id: number;
  shopId: number;
  fleetId: number;
  fleetPlate?: string;
  fleetType?: string;
  items: { productId: number; title: string; size: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  fee: number;
  total: number;
  paymentMode?: string;
  installmentCount?: number;
  status: string;
  proformaNumber: string;
  deliveryCode?: string | null;
  createdAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && csrfToken) headers.set('X-CSRF-TOKEN', csrfToken);
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
  if (!response.ok) {
    let message = 'خطا در ارتباط با سرور';
    try {
      message = (await response.json()).message ?? message;
    } catch {
      /* body is not json */
    }
    throw new Error(message);
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

export const authApi = {
  csrf: async () => {
    const response = await request<{ requestToken: string }>('/api/admin/auth/csrf');
    csrfToken = response.requestToken;
  },
  login: (username: string, password: string) =>
    request<AdminSession>('/api/admin/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  me: () => request<AdminSession>('/api/admin/auth/me'),
  logout: () => request<void>('/api/admin/auth/logout', { method: 'POST' }),
  changePassword: (currentPassword: string, newPassword: string) => request<AdminSession>('/api/admin/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
};

export const productsApi = {
  brands: () => request<ProductBrand[]>(`/api/admin/product-brands?${storeQuery()}`),
  list: (q: string, page: number, pageSize: number) =>
    request<Paged<Product>>(`/api/admin/products?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}&${storeQuery()}`),
  create: (input: ProductInput) => request<Product>(`/api/admin/products?${storeQuery()}`, { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, input: ProductInput) =>
    request<Product>(`/api/admin/products/${id}?${storeQuery()}`, { method: 'PUT', body: JSON.stringify(input) }),
  remove: (id: number) => request<void>(`/api/admin/products/${id}?${storeQuery()}`, { method: 'DELETE' }),
};

export const storesApi = {
  list: () => request<StoreSummary[]>('/api/store/shops'),
  adminList: () => request<ManagedStore[]>('/api/admin/access/stores'),
  create: (input: { name: string; address: string; contactPhone: string }) => request<ManagedStore>('/api/admin/access/stores', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, input: { name: string; address: string; contactPhone: string; isActive: boolean }) => request<ManagedStore>(`/api/admin/access/stores/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  users: () => request<StoreUser[]>('/api/admin/access/users'),
  roles: () => request<StoreRole[]>('/api/admin/access/roles'),
  createUser: (input: { username: string; displayName: string; storeId: number; roleCode: string }) => request<{ user: StoreUser; temporaryPassword: string }>('/api/admin/access/users', { method: 'POST', body: JSON.stringify(input) }),
  setUserActive: (membershipId: number, isActive: boolean) => request<void>(`/api/admin/access/users/${membershipId}/active`, { method: 'PUT', body: JSON.stringify({ isActive }) }),
};

export const ordersApi = {
  list: () => request<StoreOrder[]>(`/api/admin/orders?${storeQuery()}`),
  approve: (id: number) => request<StoreOrder>(`/api/admin/orders/${id}/approve?${storeQuery()}`, { method: 'POST' }),
  reject: (id: number) => request<StoreOrder>(`/api/admin/orders/${id}/reject?${storeQuery()}`, { method: 'POST' }),
  sellerDeliver: (id: number, code: string) => request<StoreOrder>(`/api/admin/orders/${id}/seller-deliver?${storeQuery()}`, { method: 'POST', body: JSON.stringify({ code }) }),
};
