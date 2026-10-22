import { useQuery } from "react-query";

import Loading from "@/components/Loading";
import { getLoadState } from "@/services/driver/driver-api";
import Navbar from "@/layout/Navbar";
import { EmptyDataContainer, EmptyDataText } from "../cargo/CargoList/style";
import LoadStateCard from "@/components/LoadStateCard";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";
import WaitingPayment from "../payment/WaitingPayment";

import WaitingRemittance from "./WaitingRemittance";
import SendVoucher from "./SendVoucher";
import WayBill from "./WayBill";
import WayBillSent from "./WayBillSent";
import { Container, ListContainer } from "./style";
import Payment from "./Payment";

export default function LoadState() {
  const { data, isLoading, status } = useQuery("driverStatus", () =>
    getLoadState({ IsProcessFinished: false, Page: 1, Result: 10 })
  );
  // if (data) data.length = 1;
  const isArrayData = Array.isArray(data);

  return (
    <Container>
      {isLoading && <Loading />}

      {isArrayData && data.length === 1 ? (
        <>
          {data[0]?.LoadStatus === 5 ? (
            <WaitingRemittance data={data[0]} />
          ) : data[0]?.LoadStatus === 6 ? (
            <SendVoucher data={data[0]} />
          ) : data[0]?.LoadStatus === 7 || data[0]?.LoadStatus === 8 ? (
            <WayBill data={data[0]} />
          ) : data[0]?.LoadStatus === 9 ? (
            <WayBillSent data={data[0]} />
          ) : data[0]?.LoadStatus === 10 ? (
            <Payment data={data[0]} />
          ) : data[0]?.LoadStatus === 11 ? (
            <WaitingPayment data={data[0]} />
          ) : null}
        </>
      ) : (
        <Navbar title="وضعیت بار" isBackButtonVisible={false}>
          <ListContainer>
            <Typography type="LabelLarge" width="100%">
              بار های فعال
            </Typography>
            {isArrayData &&
              data.map((items, idx) => (
                <LoadStateCard data={items} key={idx} />
              ))}
            {status === "success" && isArrayData && data.length === 0 && (
              <EmptyDataContainer>
                <Image src="/history/history-movement.svg" alt="empty-list" />
                <EmptyDataText>شما هیچ بار فعالی ندارید</EmptyDataText>
              </EmptyDataContainer>
            )}
          </ListContainer>
        </Navbar>
      )}
    </Container>
  );
}
