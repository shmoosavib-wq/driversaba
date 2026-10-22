export interface ProfileType {
  FullName: string;
  AddressImage: string;
  ProfileStepStatus: number;
}

export interface CargoCartType {
  LogisticRequestAppId: number;
  PersianTransportTime: string;
  PureCost: number;
  OriginCity: string;
  DestinationCity: string;
  Good: string;
  CarrierEquipmentType: string[];
  Count: number;
  HasTonnage: boolean;
}

export interface ListItemType {
  cards: CargoCartType[];
  id: string;
  title: string;
}

export enum CarType {
  vanet = 8,
  khavar = 10,
  oneMehvare = 11,
  twoMehvare = 12,
  tereily = 13,
}

export enum AuthenticationType {
  unAutorized = 0,
  userInformation = 1,
  addVehicle = 2,
  waitingAuthentication = 3,
  authorized = -1,
}

export interface StatusType {
  data?: {
    CarrierEquipmentTitle: string;
    CarrierEquipmentTypeId: number;
    CreatedDate: string;
    DestinationCity: string;
    Good: string;
    LicensePlate: string;
    LoadStatus: number;
    LogisticRequestAppId: number;
    OriginAddressContext: string;
    OriginCity: string;
    PersianTransportTime: string;
    ReceiverFullName: string;
    ReceiverMobileNumber: string;
    SecondDriver: { FirstName: string; LastName: string; MobileNumber: string };
    VoucherPhoto: string;
    WayBillPhoto: string;
  };
}

export interface SecondDriverType {
  Id: string;
  FirstName: string;
  LastName: string;
  NationalCode: string;
  MobileNumber: string;
  PersianBirthDate: string;
}

export interface SecondDriverInfoType {
  nationalCode: string;
  mobileNumber: string;
}

export enum OnBoardingType {
  HomeList = "onboarding-home-list",
  HomeProfile = "onboarding-home-profile",
}
