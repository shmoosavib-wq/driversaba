import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Navbar from "@/layout/Navbar";
import { getUserProfileDetail } from "@/services/profile/profile-api";
import Loading from "@/components/Loading";

import Authentication from "./Authentication";
import UserInformation from "./UserInformation";
import AddVehicle from "./AddVehicle";
import WaitingAuthentication from "./WaitingAuthentication";

const steps = [
  {
    title: "احراز هویت",
    id: 1,
  },
  {
    title: "اطلاعات کاربری",
    id: 2,
  },
  {
    title: "ثبت ناوگان",
    id: 3,
  },
];

export default function Identity() {
  const Navigation = useNavigate();
  const { data, isLoading, isSuccess } = useQuery(
    "PROFILE",
    getUserProfileDetail
  );

  useEffect(() => {
    if (isSuccess) {
      setCurrent(data?.ProfileStepStatus);
    }
    if (data?.ProfileStepStatus === -1) {
      Navigation("/");
    }
  }, [isSuccess, data]);
  const [current, setCurrent] = useState(data?.ProfileStepStatus);
  const [showVehicleDetail, setShowVehicleDetail] = useState(false);

  const onNext = () => {
    setCurrent(current + 1);
  };

  if (isLoading) {
    return (
      <LoadingConatainer>
        <Loading />
      </LoadingConatainer>
    );
  }

  return (
    <>
      {current === 0 && (
        <Navbar title={"احراز هویت"} current={current} steps={steps}>
          <Authentication onNext={onNext} />
        </Navbar>
      )}
      {current === 1 && (
        <Navbar title={"اطلاعات کاربری"} current={current} steps={steps}>
          <UserInformation onNext={onNext} />
        </Navbar>
      )}
      {current === 2 && (
        <Navbar title={"اطلاعات ناوگان"} current={current} steps={steps}>
          <AddVehicle setShowVehicleDetail={setShowVehicleDetail} />
        </Navbar>
      )}
      {current === 3 && (
        <Navbar title={"احراز هویت"} current={0} steps={steps}>
          <WaitingAuthentication />
        </Navbar>
      )}
    </>
  );
}

export const LoadingConatainer = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
