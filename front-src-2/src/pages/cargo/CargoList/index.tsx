import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCargo, useFilter } from "@/store";
import UserNetwork from "@/hooks/UserNetwork";
import CargoCard from "@/components/CargoCard";
import NavCargoList from "@/components/NavCargoList";
import Loading from "@/components/Loading";
import { ListItemType } from "@/types";
import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";
import Filter from "@/components/Filter";
import theme from "@/theme";
import Animation from "@/components/Animation";

import {
  MainContainer,
  CardContainer,
  EmptyDataContainer,
  NetworkContainer,
  TitleCotainerCard,
  ButtonContent,
  FilterButton,
} from "./style";
import parseData from "./parseData";
import Tutorial from "./Tutorial";

export default function CargoList() {
  const listRef = useRef();
  const [list, setList] = useState<ListItemType[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [countFilters, setCountFilters] = useState(0);
  const [filterParams, setFilterParams] = useState({
    DriverEquipmentIdList: null,
    HasTip: false,
    GoodId: null,
  });

  const { logisticDate } = useCargo((state) => state);
  const { addressId, geographicCoordinatesAroundMe } = useFilter(
    (state) => state
  );

  useEffect(() => {
    let newCountFilters = 0;

    if (
      filterParams.DriverEquipmentIdList &&
      filterParams.DriverEquipmentIdList.length > 0
    ) {
      newCountFilters++;
    }

    if (filterParams.HasTip !== false) {
      newCountFilters++;
    }

    if (filterParams.GoodId !== null) {
      newCountFilters++;
    }

    setCountFilters(newCountFilters);
  }, [filterParams]);

  const qkey = [
    "cargos",
    logisticDate,
    addressId,
    filterParams,
    geographicCoordinatesAroundMe,
  ];

  const queryParams = {
    Result: 8,
    LogisticDateTime: logisticDate,
    AddressId: addressId,
    HasTip: filterParams.HasTip,
    GoodId: filterParams.GoodId,
    GeographicCoordinatesAroundMe: geographicCoordinatesAroundMe,
    ...filterParams?.DriverEquipmentIdList?.reduce((acc, id) => {
      acc[`DriverEquipmentIdList`] = acc[`DriverEquipmentIdList`] || [];
      acc[`DriverEquipmentIdList`].push(id);
      return acc;
    }, {}),
  };

  const {
    data,
    hasNextPage,
    status,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteScroll(qkey, queryParams, "/Driver/AnnouncementHall?Page=");

  useEffect(() => {
    if (data) setList(parseData(data));
  }, [data]);

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  let userNetworkStatus = UserNetwork() === false;

  if (userNetworkStatus) {
    return (
      <NetworkContainer>
        <Image src="/user-network.svg" alt="error-network" />
        <Typography type="LabelMedium">
          اینترنت شما دچار اختلال شده است
        </Typography>
      </NetworkContainer>
    );
  }

  return (
    <MainContainer id="initial-introduction">
      {/* {isLoading && <Animation />} */}
      <NavCargoList />

      <Tutorial data={data} />

      <CardContainer ref={listRef}>
        {status === "success" && data?.pages[0].results.length === 0 && (
          <>
            <EmptyDataContainer>
              <Image src="/history/history-movement.svg" alt="empty-list" />
              <Typography type="LabelMedium" color={theme.colors.Gray600}>
                باری جهت نمایش وجود ندارد
              </Typography>
            </EmptyDataContainer>
          </>
        )}

        <FilterButton>
          <ButtonKit
            shape="pill"
            width="90px"
            height="40px"
            theme={countFilters > 0 ? "black" : "white"}>
            <ButtonContent
              onClick={() => {
                setOpenFilter(true);
              }}>
              {countFilters > 0 ? ` ${countFilters} فیلتر` : "فیلترها"}

              <Image
                src={`/cargo/filter/${countFilters ? "whiteFilter" : "filter"}.svg`}
              />
            </ButtonContent>
          </ButtonKit>
        </FilterButton>
        {!isLoading &&
          list?.map((i, idx) => (
            <>
              <div style={{ position: "relative" }} key={idx}>
                <TitleCotainerCard>
                  <Typography type="LabelLarge" alignSelf="center">
                    {i.title}
                  </Typography>
                </TitleCotainerCard>
                {i.cards.map((card, idx2) => (
                  <CargoCard key={idx2} item={card} />
                ))}
              </div>
            </>
          ))}
        <div ref={ref}>
          {(isLoading || isFetchingNextPage) && (
            <Loading $size={20} containerStyle={{ height: "100px" }} />
          )}
        </div>
      </CardContainer>
      {openFilter && (
        <Filter
          setPreviousList={setList}
          setOpenFilterPage={setOpenFilter}
          setFilterParams={setFilterParams}
        />
      )}
    </MainContainer>
  );
}
