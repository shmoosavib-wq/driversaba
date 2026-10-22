import type { RouteObject } from "react-router-dom";

import AddVehicle from "@/pages/identify/AddVehicle";
import Profile from "@/pages/profile";
import { Layout } from "@/components";
import UserInformation from "@/pages/identify/UserInformation";
import Identity from "@/pages/identify";
import MyVehicle from "@/pages/MyVehicle";
import AcceptCargo from "@/pages/cargo/AcceptCargo";
import HistoryMovement from "@/pages/HistoryMovement";
import CargoList from "@/pages/cargo/CargoList";
import CargoDetail from "@/pages/cargo/CargoDetail";
import Navbar from "@/layout/Navbar";
import VehicleDetail from "@/pages/identify/VehicleDetails";
import WeigthUpload from "@/pages/loadState/WeightUpload";
import LoadState from "@/pages/loadState";
import MovementInformation from "@/pages/MovementInformation";
import WayBill from "@/pages/loadState/WayBill";
import WayBillSent from "@/pages/loadState/WayBillSent";
import WaitingRemittance from "@/pages/loadState/WaitingRemittance";
import SendVoucher from "@/pages/loadState/SendVoucher";
import Payment from "@/pages/loadState/Payment";
import WaitingPayment from "@/pages/payment/WaitingPayment";
import AddSheba from "@/pages/payment/AddSheba";
import Invite from "@/pages/Invite";
import ShebaDeposit from "@/pages/payment/ShebaDeposit";
import SabaDeposit from "@/pages/payment/SabaDeposit";
import TireStore from "@/pages/TireStore";

// path => kebab-case
const ProtectedRoutes: RouteObject[] = [
  {
    path: "/AddVehicle",
    element: <AddVehicle />,
  },
  {
    path: "/editInformation",
    element: (
      <Navbar title={"ویرایش"}>
        <UserInformation />
      </Navbar>
    ),
  },
  {
    path: "/invitation",
    element: (
      <Navbar title={"دعوت از دوستان"}>
        <Invite />
      </Navbar>
    ),
  },
  {
    path: "/cargoList",
    element: <CargoList />,
  },
  {
    path: "/load-state",
    element: <LoadState />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/tire-store",
    element: <TireStore />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/saba-deposit",
    element: (
      <Navbar title="واریز وجه">
        <SabaDeposit />
      </Navbar>
    ),
  },
  {
    path: "/add-sheba",
    element: (
      <Navbar title="افزودن شبا">
        <AddSheba />
      </Navbar>
    ),
  },
  {
    path: "/sheba-deposit",
    element: (
      <Navbar title="واریز وجه">
        <ShebaDeposit />
      </Navbar>
    ),
  },
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: "/UserInformation",
    element: <UserInformation />,
  },
  {
    path: "/Identity",
    element: <Identity />,
  },
  {
    path: "/cargo-List",
    element: <CargoList />,
  },
  {
    path: "/MyVehicle",
    element: (
      <Navbar title="ناوگان های من">
        <MyVehicle />
      </Navbar>
    ),
  },
  {
    path: "/cargoDetail",
    element: <CargoDetail />,
  },
  {
    path: "/AcceptCargo",
    element: <AcceptCargo />,
  },
  {
    path: "/editVehicle",
    element: (
      <Navbar title={"ویرایش ناوگان"}>
        <VehicleDetail />
      </Navbar>
    ),
  },
  {
    path: "/movement-information",
    element: <MovementInformation />,
  },
  {
    path: "/HistoryMovement",
    element: <HistoryMovement />,
  },
  {
    path: "/upload-loading-weight",
    element: (
      <Navbar title="وزن بارگیری">
        <WeigthUpload />
      </Navbar>
    ),
  },
  {
    path: "/upload-unloading-weight",
    element: (
      <Navbar title="وزن تخلیه">
        <WeigthUpload />
      </Navbar>
    ),
  },

  {
    path: "/send-voucher",
    element: <SendVoucher />,
  },
  ///to-do:change route name
  {
    path: "/waybill",
    element: <WayBill />,
  },
  {
    path: "/waybill-sent",
    element: <WayBillSent />,
  },
  {
    path: "/waiting-remittance",
    element: <WaitingRemittance />,
  },
  // Payment --- Routes
  {
    path: "/waiting-payment",
    element: <WaitingPayment />,
  },
];

export default ProtectedRoutes;
