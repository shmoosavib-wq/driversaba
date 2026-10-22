import axios from "axios";
import Cookies from "js-cookie";

const TIRE_STORE_API = axios.create({
  baseURL: process.env.REACT_APP_TIRE_STORE_BASE_URL || "http://localhost:5188",
  headers: { accept: "application/json", "Content-Type": "application/json" },
});

TIRE_STORE_API.interceptors.request.use((config) => {
  const token = Cookies.get("Token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export type TireProduct = { id: number; brand: string; model: string; size: string; width?: number; profile?: number; rim?: string; pattern?: string; axlePosition?: string; loadIndex?: string; year?: number; country?: string; warranty?: string; price: number; compareAtPrice?: number | null; stock: number; warrantyMonths: number; description: string; images?: string[] };
export type TireShop = { id: number; name: string; address: string; productCount: number };
export type TireStoreCapabilities = { commerceEnabled: boolean };
export type TireCredit = { limit: number; used: number; status: string; feeRate: number; installments: number; firstPaymentAtPurchase: boolean; fleetId?: number | null; limitEnforced?: boolean };
export type TireOrderItem = { productId: number; title: string; size: string; quantity: number; unitPrice: number };
export type PaymentMode = "Cash" | "Installments";
export type TireOrder = { id: number; proformaNumber: string; deliveryFrom?: string | null; deliveryTo?: string | null; deliveredAt?: string | null; shopId: number; fleetId: number; fleetPlate?: string; fleetType?: string; paymentMode?: PaymentMode; installmentCount?: number; items: TireOrderItem[]; subtotal: number; fee: number; total: number; status: "AwaitingFirstPayment" | "AwaitingSellerApproval" | "Approved" | "Rejected" | "AwaitingDriverConfirm" | "Delivered"; deliveryCode?: string | null; createdAt: string };
export type TireInstallment = { id: number; orderId: number; number: number; amount: number; dueDate: string; status: string; paidAt?: string | null; gateway?: string | null };
export type Quote = { subtotal: number; fee: number; total: number; firstInstallment: number; nextInstallment: number; lastInstallment: number; installments: number; firstPaymentAtPurchase: boolean; paymentMode: PaymentMode };
export type CreditRequest = { fleetId: number; amount: number };
export type TirePaymentStart = { checkoutUrl: string; provider: string };

export const getTireStoreCapabilities = () => TIRE_STORE_API.get<TireStoreCapabilities>("/api/store/capabilities").then((r) => r.data);
export const getTireShops = () => TIRE_STORE_API.get<TireShop[]>("/api/store/shops").then((r) => r.data);
export const getTireProducts = (shopId?: number) => TIRE_STORE_API.get<TireProduct[]>("/api/store/products", { params: { shopId } }).then((r) => r.data);
export const getTireCredit = () => TIRE_STORE_API.get<TireCredit>("/api/store/credit").then((r) => r.data);
export const requestTireCredit = (input: CreditRequest) => TIRE_STORE_API.post("/api/store/credit/request", input).then((r) => r.data);
export const quoteTireOrder = (items: { productId: number; quantity: number }[], shopId: number, paymentMode: PaymentMode, installmentCount: number) => TIRE_STORE_API.post<Quote>("/api/store/orders/quote", { items, shopId, paymentMode, installmentCount }).then((r) => r.data);
export const createTireOrder = (shopId: number, fleetId: number, items: { productId: number; quantity: number }[], fleetPlate: string, fleetType: string, paymentMode: PaymentMode, installmentCount: number) => TIRE_STORE_API.post<TireOrder>("/api/store/orders", { shopId, fleetId, items, fleetPlate, fleetType, paymentMode, installmentCount }).then((r) => r.data);
export const getTireOrder = (id: number) => TIRE_STORE_API.get<TireOrder>(`/api/store/orders/${id}`).then((r) => r.data);
export const getTireOrders = () => TIRE_STORE_API.get<TireOrder[]>("/api/store/orders").then((r) => r.data);
export const getTireInstallments = (orderId?: number) => TIRE_STORE_API.get<TireInstallment[]>("/api/store/installments", { params: { orderId } }).then((r) => r.data);
export const startTirePayment = (id: number) => TIRE_STORE_API.post<TirePaymentStart>(`/api/store/installments/${id}/payment`).then((r) => r.data);
export const approveTireOrder = (id: number) => TIRE_STORE_API.post<TireOrder>(`/api/store/orders/${id}/approve`).then((r) => r.data);
export const rejectTireOrder = (id: number) => TIRE_STORE_API.post<TireOrder>(`/api/store/orders/${id}/reject`).then((r) => r.data);
export const setTireDeliveryWindow = (id: number, date: string, startHour: number) => TIRE_STORE_API.post<TireOrder>(`/api/store/orders/${id}/delivery-window`, { date, startHour }).then((r) => r.data);
export const sellerDeliverTireOrder = (id: number) => TIRE_STORE_API.post<TireOrder>(`/api/store/orders/${id}/seller-deliver`).then((r) => r.data);
export const driverConfirmTireOrder = (id: number) => TIRE_STORE_API.post<TireOrder>(`/api/store/orders/${id}/driver-confirm`).then((r) => r.data);
export const approveTireCredit = (): Promise<TireCredit> => {
  if (process.env.NODE_ENV !== "development") return Promise.reject(new Error("Demo credit approval is only available in development."));
  return TIRE_STORE_API.post<TireCredit>("/api/store/credit/demo-approve").then((response) => response.data);
};
