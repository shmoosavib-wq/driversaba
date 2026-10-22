import { CargoCartType, ListItemType } from "@/types";

export default function parseData(d): ListItemType[] {
  const items = d?.pages?.map((i) => i.results).flat();
  if (!items.length) return [];

  const obj = {};
  items.forEach((i) => {
    let key = i.PersianTransportTime;
    if (!obj[key]) obj[key] = [];

    obj[key].push(i);
  });

  const list = Object.entries(obj).map(([k, v]) => ({
    id: k,
    title: k,
    cards: v as CargoCartType[],
  }));

  return list;
}
