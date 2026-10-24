import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toaster } from "baseui/toast";
import { getFleetsInfo } from "@/services/equipment/equipment-api";
import { fleetId, fleetName, fleetPlate } from "./helpers";
import {
  approveTireCredit, createTireOrder, driverConfirmTireOrder, getTireCredit, getTireInstallments, getTireOrder, getTireOrders, getTireProducts, getTireShops, getTireStoreCapabilities,
  startTirePayment, quoteTireOrder, requestTireCredit, setTireDeliveryWindow, PaymentMode, TireInstallment, TireOrder, TireProduct, getTireInstallmentPlans,
} from "@/services/tire-store-api";

import { useTireCart } from "./hooks/useTireCart";
import { Screen } from "./Shared";
import { Home, CreditSheet } from "./Home";
import { Catalog, ProductDetail, Shops } from "./Catalog";
import { Confirm, Gateway } from "./Checkout";
import { History } from "./History";
import { AwaitingSeller, DeliveryCode, Installments, Proforma, Rejected } from "./OrderScreens";

type View = "home" | "shops" | "catalog" | "detail" | "confirm" | "gateway" | "awaiting" | "proforma" | "code" | "rejected" | "installments" | "history";
type Payment = { installmentId: number; amount: number; orderId: number };

const TITLES: Record<View, string> = {
  home: "خرید قسطی تایر", shops: "فروشگاه‌ها", catalog: "انتخاب تایر", detail: "جزئیات محصول", confirm: "تایید و شرایط پرداخت", gateway: "درگاه پرداخت",
  proforma: "پیش‌فاکتور تاییدشده", awaiting: "وضعیت سفارش", code: "کد تحویل", rejected: "وضعیت سفارش", installments: "قسط‌های من", history: "تاریخچه خرید و فاکتورها",
};

export default function TireStore() {
  const navigate = useNavigate();
  const location = useLocation();
  const client = useQueryClient();
  const [view, setView] = useState<View>(() => {
    const query = new URLSearchParams(location.search);
    const requestedView = query.get("view");
    return process.env.NODE_ENV !== "production" && (requestedView === "installments" || requestedView === "history" || requestedView === "proforma" || requestedView === "awaiting") ? requestedView : "home";
  });
  const [history, setHistory] = useState<View[]>([]);
  const [shopId, setShopId] = useState(1);

  const [detail, setDetail] = useState<TireProduct | null>(null);
  const [sheet, setSheet] = useState(false);

  const [orderId, setOrderId] = useState(() => Number(new URLSearchParams(location.search).get("orderId")) || 0);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Installments");
  const [installmentCount, setInstallmentCount] = useState(4);

  const capabilities = useQuery("TIRE_STORE_CAPABILITIES", getTireStoreCapabilities, { staleTime: Infinity });
  const commerceEnabled = capabilities.data?.commerceEnabled ?? process.env.NODE_ENV === "development";
  const fleets = useQuery(["TIRE_FLEETS"], getFleetsInfo, { enabled: commerceEnabled });
  const shops = useQuery("TIRE_SHOPS", getTireShops);
  const products = useQuery(["TIRE_PRODUCTS", shopId], () => getTireProducts(shopId), { refetchInterval: 15000 });
  const installmentPlansQuery = useQuery(["TIRE_INSTALLMENT_PLANS", shopId], () => getTireInstallmentPlans(shopId), { enabled: commerceEnabled });
  const credit = useQuery("TIRE_CREDIT", getTireCredit, { enabled: commerceEnabled, refetchInterval: (data) => (data?.status === "Pending" ? 5000 : false) });
  const orders = useQuery("TIRE_ORDERS", getTireOrders, { enabled: commerceEnabled, refetchInterval: commerceEnabled ? 5000 : false });
  const order = useQuery(["TIRE_ORDER", orderId], () => getTireOrder(orderId), { enabled: commerceEnabled && orderId > 0, refetchInterval: view === "awaiting" ? 4000 : false });
  const installments = useQuery(["TIRE_INSTALLMENTS"], () => getTireInstallments(), { enabled: commerceEnabled && (view === "installments" || view === "history" || view === "awaiting") });

  const { cart, items, lines, setCart, changeQty } = useTireCart(products.data);
  const approved = credit.data?.status === "Approved";
  const availableCredit = approved ? Math.max(0, credit.data.limit - credit.data.used) : 0;
  const canInstallments = approved && availableCredit > 0;
  const installmentPlans = installmentPlansQuery.data || [];
  const activeInstallmentPlans = installmentPlans.filter((plan) => plan.isActive);
  const selectedPlan = activeInstallmentPlans.find((plan) => plan.installmentCount === installmentCount) || activeInstallmentPlans[0];
  const effectiveInstallmentCount = selectedPlan?.installmentCount ?? installmentCount;
  const effectivePaymentMode: PaymentMode = paymentMode === "Installments" && activeInstallmentPlans.length === 0 ? "Cash" : paymentMode;
  const installmentUnavailableReason = activeInstallmentPlans.length === 0 ? "در این فروشگاه روش اقساطی فعالی وجود ندارد." : undefined;
  const quote = useQuery(["TIRE_QUOTE", shopId, items, effectivePaymentMode, effectiveInstallmentCount, availableCredit], () => quoteTireOrder(items, shopId, effectivePaymentMode, effectiveInstallmentCount), { enabled: commerceEnabled && items.length > 0 && credit.isFetched && installmentPlansQuery.isFetched });
  const allProducts = products.data || [];

  const MOCK_FLEETS = [
    { Id: 101, VehicleType: "لیفتراک ۳ تنی", PlateNumber: "۱۲ ب ۳۴۵ ایران ۶۸" },
    { Id: 102, VehicleType: "کامیونت باری", PlateNumber: "۴۵ ج ۶۷۸ ایران ۱۱" },
  ];
  const useMock = fleets.isError && process.env.NODE_ENV === "development";
  const fleetList = useMock ? MOCK_FLEETS : Array.isArray(fleets.data) ? fleets.data : [];


  const selectedFleet = effectivePaymentMode === "Installments"
    ? fleetList.find((fleet: any) => fleetId(fleet) === credit.data?.fleetId)
    : undefined;
  const activeOrder = commerceEnabled ? (orders.data || []).find((o) => ["AwaitingSellerApproval", "AwaitingFirstPayment", "Approved", "AwaitingDriverConfirm"].includes(o.status)) : undefined;

  const go = (next: View) => { setHistory((h) => [...h, view]); setView(next); };
  const back = () => {
    if (!history.length) return navigate(-1);
    setView(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };
  const reset = (next: View) => { setHistory(["home"]); setView(next); };
  const refresh = () => ["TIRE_CREDIT", "TIRE_ORDERS", "TIRE_ORDER", "TIRE_INSTALLMENTS", "TIRE_PRODUCTS"].forEach((k) => client.invalidateQueries(k));
  const fail = (err: any): void => { toaster.negative(err?.response?.data?.message || (err instanceof Error ? err.message : "") || "خطایی رخ داد. دوباره تلاش کن.", {}); };

  const creditRequest = useMutation((fleetId: number) => requestTireCredit({ fleetId, amount: 100000000 }), {
    onSuccess: () => { setSheet(false); refresh(); toaster.info("درخواست اعتبار ثبت شد و منتظر بررسی است."); },
    onError: fail,
  });
  const createOrder = useMutation(() => {
    if (effectivePaymentMode === "Installments" && !canInstallments) return Promise.reject(new Error("اعتبار کافی برای پرداخت اقساطی ندارید؛ روش نقدی را انتخاب کنید یا ابتدا اعتبار بگیرید."));

    if (effectivePaymentMode === "Installments" && !selectedFleet) return Promise.reject(new Error("ناوگان متصل به اعتبار پیدا نشد."));
    return createTireOrder(shopId, selectedFleet ? fleetId(selectedFleet) : 0, items, selectedFleet ? fleetPlate(selectedFleet) : null, selectedFleet ? fleetName(selectedFleet) : null, effectivePaymentMode, effectiveInstallmentCount);
  }, {
    onSuccess: (created) => {
      setOrderId(created.id);
      setCart({});
      refresh();
      reset("awaiting");
      toaster.positive("پیش‌فاکتور برای فروشنده ارسال شد.", {});
    },
    onError: fail,
  });
  const pay = useMutation(() => startTirePayment(payment!.installmentId), {
    onSuccess: (started) => window.location.assign(started.checkoutUrl),
    onError: fail,
  });
  const orderUpdate = { onSuccess: (updated: TireOrder) => { refresh(); client.setQueryData(["TIRE_ORDER", updated.id], updated); }, onError: fail };
  const windowMut = useMutation((r: { date: string; hour: number }) => setTireDeliveryWindow(orderId, r.date, r.hour), orderUpdate);
  const driverConfirm = useMutation(() => driverConfirmTireOrder(orderId), orderUpdate);



  const openStore = () => go("shops");
  const startCheckout = () => {
    if (!commerceEnabled) { toaster.info("در این مرحله فقط مشاهده‌ی محصولات و قیمت‌ها فعال است."); return; }
    if (effectivePaymentMode === "Installments" && activeOrder?.paymentMode === "Installments") {
      toaster.info("یک خرید قسطی در جریان داری؛ ابتدا وضعیت همان سفارش را پیگیری کن.");
      setOrderId(activeOrder.id);
      go("awaiting");
      return;
    }
    if (items.length === 0) { toaster.info("سبد خرید خالی است."); return; }
    go("confirm");
  };
  const demoApprove = useMutation(approveTireCredit, {
    onSuccess: (updated) => {
      client.setQueryData("TIRE_CREDIT", updated);
      setSheet(false);
      refresh();
    },
    onError: fail,
  });
  const openActive = () => {
    if (!activeOrder) return;
    setOrderId(activeOrder.id);
    return go("awaiting");
  };
  const payFirst = () => {
    getTireInstallments(orderId).then((list) => {
      setPayment({ installmentId: list[0].id, amount: list[0].amount, orderId });
      go("gateway");
    });
  };
  const payInstallment = (i: TireInstallment) => { setPayment({ installmentId: i.id, amount: i.amount, orderId: i.orderId }); go("gateway"); };

  useEffect(() => {
    if (!capabilities.isFetched) return;
    const query = new URLSearchParams(location.search);
    const result = query.get("paymentResult");
    if (result !== "success" && result !== "failed") return;
    if (!commerceEnabled) {
      toaster.info("خرید و پرداخت در این مرحله فعال نیست.");
      navigate(location.pathname, { replace: true });
      return;
    }
    const returnedOrderId = Number(query.get("orderId")) || 0;
    const returnedView = query.get("view");
    if (returnedOrderId) setOrderId(returnedOrderId);
    if (returnedView === "awaiting" || returnedView === "proforma" || returnedView === "installments") setView(returnedView);
    ["TIRE_ORDERS", "TIRE_ORDER", "TIRE_INSTALLMENTS"].forEach((key) => client.invalidateQueries(key));
    if (result === "success") toaster.positive("پرداخت توسط درگاه تأیید و ثبت شد.");
    else toaster.negative("پرداخت تأیید نشد؛ می‌توانی دوباره تلاش کنی.");
    const cleanSearch = returnedView && returnedOrderId ? `?view=${returnedView}&orderId=${returnedOrderId}` : "";
    navigate(`${location.pathname}${cleanSearch}`, { replace: true });
  }, [capabilities.isFetched, client, commerceEnabled, location.pathname, location.search, navigate]);

  const status = order.data?.status;
  const effective: View = view === "awaiting" && status === "AwaitingFirstPayment" ? "proforma" : view === "awaiting" && (status === "Approved" || status === "AwaitingDriverConfirm" || status === "Delivered") ? "code" : view === "awaiting" && status === "Rejected" ? "rejected" : view;
  const orderInstallments = installments.data?.filter((i) => i.orderId === order.data?.id) || [];
  const fullyPaid = order.data?.paymentMode !== "Cash" && orderInstallments.length > 0 && orderInstallments.every((i) => i.status === "Paid");
  const screenTitle = !commerceEnabled && effective === "home" ? "فروشگاه تایر" : effective === "code" && fullyPaid ? "خلاصه خرید" : effective === "code" && status === "Delivered" ? "وضعیت سفارش" : TITLES[effective];
  const limit = credit.data?.limit || 0;
  const used = credit.data?.used || 0;

  return (
    <Screen title={screenTitle} onBack={back}>

      {effective === "home" && (
        <Home commerceEnabled={commerceEnabled} credit={credit.data} activeOrder={activeOrder} onCreditAction={() => setSheet(true)} onStore={openStore}
          onActiveOrder={openActive} />
      )}
      {effective === "shops" && <Shops shops={shops.data || []} onPick={(id) => { setShopId(id); setCart({}); go("catalog"); }} />}
      {effective === "catalog" && (
          <Catalog commerceEnabled={commerceEnabled} shop={(shops.data || []).find((s) => s.id === shopId)} products={allProducts} cart={cart} remaining={availableCredit} canInstallments={canInstallments} installmentPlans={activeInstallmentPlans} installmentCount={effectiveInstallmentCount} feeRate={selectedPlan?.feeRate || 0} onInstallmentCount={(count) => setInstallmentCount(count)}
          onQty={changeQty} onOpen={(p) => { setDetail(p); go("detail"); }} onCheckout={startCheckout} />
      )}
      {effective === "detail" && detail && <ProductDetail commerceEnabled={commerceEnabled} product={detail} qty={cart[detail.id] || 0} remaining={availableCredit} canInstallments={canInstallments} installmentPlans={activeInstallmentPlans} installmentCount={effectiveInstallmentCount} feeRate={selectedPlan?.feeRate || 0} onInstallmentCount={(count) => setInstallmentCount(count)} onQty={changeQty} onCheckout={startCheckout} />}
      {commerceEnabled && effective === "confirm" && <Confirm lines={lines} quote={quote.data} quoteLoading={quote.isLoading} quoteError={quote.isError} paymentMode={effectivePaymentMode} canInstallments={canInstallments} installmentPlans={activeInstallmentPlans} installmentCount={effectiveInstallmentCount} onInstallmentCount={(count) => setInstallmentCount(count)} installmentUnavailableReason={installmentUnavailableReason} loading={createOrder.isLoading} onPaymentMode={(mode) => setPaymentMode(mode)} onRetryQuote={() => { void quote.refetch(); }} onConfirm={() => createOrder.mutate()} />}
      {commerceEnabled && effective === "gateway" && payment && <Gateway amount={payment.amount} loading={pay.isLoading} onPay={() => pay.mutate()} />}
      {commerceEnabled && effective === "awaiting" && order.data && <AwaitingSeller order={order.data} shopName={(shops.data || []).find((s) => s.id === order.data!.shopId)?.name} />}
      {commerceEnabled && effective === "proforma" && order.data && <Proforma order={order.data} shopName={(shops.data || []).find((s) => s.id === order.data!.shopId)?.name} onPay={payFirst} />}
        {commerceEnabled && effective === "code" && order.data && <DeliveryCode order={order.data} shopName={(shops.data || []).find((s) => s.id === order.data!.shopId)?.name} shopAddress={(shops.data || []).find((s) => s.id === order.data!.shopId)?.address} installments={orderInstallments} saving={windowMut.isLoading || driverConfirm.isLoading} onWindow={(date, hour) => windowMut.mutate({ date, hour})} onDriverConfirm={() => driverConfirm.mutate()} onBackHome={() => { setHistory([]); setView("home"); }} onHistory={() => reset("history")} />}
      {commerceEnabled && effective === "rejected" && order.data && <Rejected order={order.data} onBack={() => reset("home")} />}
      {commerceEnabled && effective === "history" && <History orders={orders.data || []} installments={installments.data || []} shops={shops.data || []} onOpen={(o) => { setOrderId(o.id); go("awaiting"); }} />}
      {commerceEnabled && effective === "installments" && <Installments installments={installments.data || []} limit={limit} used={used} onPay={payInstallment} />}
      {commerceEnabled && sheet && (
        <CreditSheet status={credit.data?.status || "None"} fleets={fleetList} loading={creditRequest.isLoading || demoApprove.isLoading} onClose={() => setSheet(false)}
          onRegisterFleet={() => navigate("/addVehicle")} onSubmit={(fleet) => creditRequest.mutate(fleet)} onDemoApprove={() => { if (!demoApprove.isLoading) demoApprove.mutate(); }} />
      )}
    </Screen>
  );
}
