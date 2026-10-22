import { useInfiniteQuery } from "react-query";

import API from "@/services/api-manager";

export const useInfiniteScroll = (queryKey, queryParams, inputUrl) => {
  const getInfiniteScrollData = async ({ pageParam = 1 }) => {
    const res = await API({
      method: "GET",
      url: `${inputUrl}${pageParam}`,
      params: queryParams,
      paramsSerializer: { indexes: null },
    });

    return {
      results: res.data.Content,
      nextPage: pageParam + 1,
      totalPagesFetched: pageParam,
      pageCount: res.data?.Meta?.Pages,
    };
  };

  return useInfiniteQuery(queryKey, getInfiniteScrollData, {
    // keepPreviousData: true,
    staleTime: 6000 * 10, // 1 دقیقه
    cacheTime: 6000 * 10, // 1 دقیقه

    getNextPageParam: (lastPage) => {
      if (lastPage.totalPagesFetched < lastPage.pageCount) {
        return lastPage.nextPage;
      }
      return undefined;
    },
  });
};
