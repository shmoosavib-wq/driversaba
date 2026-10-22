import { useQueryClient } from "react-query";

export const useGetFetchQuery = (name: string) =>
  useQueryClient().getQueryData(name);
