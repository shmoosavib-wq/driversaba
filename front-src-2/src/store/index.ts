import { create } from "zustand";

interface CargoType {
  logisticDate: string | null;
  setValue: (value: string) => void;
}

interface FilterType {
  goodTypesNames: string | null;
  Ischecked: boolean;
  equipmentIdSelected: any[];
  goodTypesId: number;
  IsReaset: boolean;
  addressId: number;
  geographicCoordinatesAroundMe: string;
  setGooodTypesNames: (value: string) => void;
  setGooodTypesId: (value: number) => void;
  setIsChecked: (value: boolean) => void;
  setEquipmentIdSelected: (value: any[]) => void;
  setAddressId: (value: number) => void;
  resetFilters: () => void;
  SetGeographicCoordinatesAroundMe: (value: string) => void;
}

interface SabaServiceT {}
interface SecondDriverInfoType {
  secondDriverInfo: any;
  setSecondDriverInfo: (value: any) => void;
}

export const useCargo = create<CargoType>((set) => ({
  logisticDate: null,
  setValue: (value) => set({ logisticDate: value }),
}));

export const useSabaServiceValue = create((set: any) => ({
  data: {},
  setSabaServiceValue: (val) =>
    set((state) => ({ data: { ...state.data, ...val } })),
  resetSabaServiceValue: () => set(() => ({ data: {} })),
}));

// Define your store
export const useFilter = create<FilterType>((set) => ({
  goodTypesNames: null,
  goodTypesId: null,
  Ischecked: false,
  IsReaset: false,
  addressId: null,
  equipmentIdSelected: [],
  geographicCoordinatesAroundMe: null,
  setGooodTypesNames: (value) => set({ goodTypesNames: value }),
  setGooodTypesId: (value) => set({ goodTypesId: value }),
  setIsChecked: (value) => set({ Ischecked: value }),
  setEquipmentIdSelected: (value) => set({ equipmentIdSelected: value }),
  setAddressId: (value) => set({ addressId: value }),
  SetGeographicCoordinatesAroundMe: (value) =>
    set({ geographicCoordinatesAroundMe: value }),

  resetFilters: () =>
    set({
      IsReaset: true,
      goodTypesNames: null,
      goodTypesId: null,
      Ischecked: false,
      equipmentIdSelected: [],
    }),
}));
