import { GetSharelinkInput, GetImageByMediaIdParams } from "./queryHooks.types";
import { gql, useQuery } from "@apollo/client";

export function useGetSharelink(_input: GetSharelinkInput) {
  const status = useQuery(
    gql`
      query GetManagerSeriesWithImageAndBasicInfo {
        getManagerSeriesWithImageAndBasicInfo {
          ID
          isFree
          priceInDollar
          image {
            ID
            variant
            url
          }
          mediaBasicInfo {
            plotSummary
            releaseDate
            title
            ID
          }
        }
      }
    `
  );
  return { ...status, isLoading: status.loading, data: status.data?.getManagerSeriesWithImageAndBasicInfo };
}

export function useGetImageByMediaId(param: GetImageByMediaIdParams) {
  const status = useQuery<{ getImageByMediaId: ImageEntityType }>(
    gql`
      query ($param: GetImageByMediaIdParams!) {
        getImageByMediaId(GetImageByMediaIdParams: $param) {
          ID
          variant
          url
        }
      }
    `,
    {
      variables: { param },
    }
  );
  return { ...status, isLoading: status.loading, data: status.data?.getImageByMediaId };
}
