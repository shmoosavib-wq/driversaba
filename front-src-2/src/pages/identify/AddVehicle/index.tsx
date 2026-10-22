import { useState } from "react";
import { useLocation } from "react-router-dom";

import VehicleType from "../VehicleType";
import VehicleDetail from "../VehicleDetails"; // Import VehicleDetail component
import Navbar from "@/layout/Navbar";

export default function AddVehicle({ setShowVehicleDetail = null }) {
  const { pathname } = useLocation();
  const isIdentityPath = pathname.includes("Identity");

  const [truckId, setTruckId] = useState(null);

  const handleVehicleTypeSubmit = (id) => {
    setTruckId(id);
    if (setShowVehicleDetail !== null) setShowVehicleDetail(true);
  };

  const content = truckId ? (
    <VehicleDetail truckId={truckId} />
  ) : (
    <VehicleType onSubmit={handleVehicleTypeSubmit} />
  );

  return isIdentityPath ? (
    <>{content}</>
  ) : (
    <Navbar title={truckId ? "اطلاعات ناوگان" : "افزودن ناوگان"}>
      <>{content}</>
    </Navbar>
  );
}
