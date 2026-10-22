import { useMemo, useState } from "react";

import type { TireProduct } from "@/services/tire-store-api";

export function useTireCart(products: TireProduct[] = []) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const items = useMemo(
    () => Object.entries(cart).map(([productId, quantity]) => ({
      productId: Number(productId),
      quantity,
    })),
    [cart]
  );
  const lines = useMemo(
    () => products.filter((product) => cart[product.id]).map((product) => ({
      product,
      qty: cart[product.id],
    })),
    [products, cart]
  );

  const changeQty = (product: TireProduct, delta: number) => {
    setCart((current) => {
      const quantity = Math.max(0, Math.min(product.stock, (current[product.id] || 0) + delta));
      const next = { ...current };
      if (quantity) next[product.id] = quantity;
      else delete next[product.id];
      return next;
    });
  };

  return { cart, items, lines, setCart, changeQty };
}
