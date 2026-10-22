import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import Navbar from "@/layout/Navbar";
import Typography from "@/components/Typography";
import theme from "@/theme";
import HistoryMovementCard from "@/components/HistoryMovementCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Loading from "@/components/Loading";
import Image from "@/components/global/Image";

import { MainContainer, EmpityMovementContainer } from "./style";

const HistoryMovement = () => {
  const listRef = useRef();

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  const qkey = ["MyLoads"];

  const queryParams = {
    Result: 5,
  };

  const {
    data,
    hasNextPage,
    status,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteScroll(qkey, queryParams, "/Driver/MyLoadsDriver?Page=");

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Navbar title={"سابقه سیرها"}>
      <MainContainer ref={listRef}>
        {status === "success" && data?.pages[0].results.length === 0 && (
          <EmpityMovementContainer>
            <Image src="/history/history-movement.svg" alt="empty" />
            <Typography
              title="شما تاکنون هیچ سیری نداشته اید"
              color={theme.colors.Gray600}
            />
          </EmpityMovementContainer>
        )}

        {data &&
          data.pages?.map((page) =>
            page.results?.map((item, idx) => (
              <HistoryMovementCard item={item} key={idx} />
            ))
          )}
        {/* upon seeing this div, the request will be sent to the server again */}
        <div ref={ref}>
          {(isLoading || isFetchingNextPage) && (
            <Loading $size={20} containerStyle={{ height: "100px" }} />
          )}
        </div>
      </MainContainer>
    </Navbar>
  );
};

export default HistoryMovement;
