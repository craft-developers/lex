import { gqlRequest } from "@/api/gqlRequest";
import useGqlError, { ErrorResponse } from "@/context/GqlErrorContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateEpisodeInput, CreateMediaImageInput, MediaImageIdOutput, GetManagerSeriesWithImageAndBasicInfoOutput, GetSeasonBySeriesIdInput, GetSeasonBySeriesIdOutput, GetUploadVideoSignedUrlInput, GetUploadVideoSignedUrlOutput, UploadVideoOnAwsS3Input, GetNextEpisodeNumberParams, GetNextEpisodeNumberOutput } from "./queryHooks.types";

export function useGetUploadVideoSignedUrl() {
  const { showGqlError } = useGqlError();
  return useMutation({
    mutationFn: async (input: GetUploadVideoSignedUrlInput) => {
      const result = await gqlRequest<{ getUploadVideoSignedUrl: GetUploadVideoSignedUrlOutput }>(
        `
          mutation($input: GetUploadVideoSignedUrlInput!) {
            getUploadVideoSignedUrl(GetUploadVideoSignedUrlInput: $input) {
              signedUrl
              signedUrlKeyId
              videoId
            }
          }
        `,
        { input }
      );
      return result;
    },
    onError: (error) => {
      showGqlError(error.response);
    },
  });
}

export function useUploadVideoOnAwsS3() {
  const { showGqlError } = useGqlError();

  return useMutation({
    mutationFn: async (input: UploadVideoOnAwsS3Input) => {
      fetch(input.SignedUrl, {
        method: "PUT",
        body: input.VideoBlob,
        headers: {
          "Content-Type": "video/*",
        },
      });
    },
    onError: (error: ErrorResponse) => {
      showGqlError(error);
    },
  });
}

export function useGetManagerSeriesWithImageAndBasicInfo() {
  return useQuery({
    queryKey: [""],
    queryFn: async () => {
      const result = await gqlRequest<{ getManagerSeriesWithImageAndBasicInfo: GetManagerSeriesWithImageAndBasicInfoOutput[] }>(
        `query GetManagerSeriesWithImageAndBasicInfo{
          getManagerSeriesWithImageAndBasicInfo{
            ID
            isFree
            priceInDollar
            mediaImage {
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
        }`
      );
      return result.getManagerSeriesWithImageAndBasicInfo;
    },
  });
}

export function useGetSeasonBySeriesId() {
  const { showGqlError } = useGqlError();
  return useMutation({
    mutationFn: async (param: GetSeasonBySeriesIdInput) => {
      const result = await gqlRequest<{ getSeasonBySeriesId: GetSeasonBySeriesIdOutput[] }>(
        `query($param: GetSeasonBySeriesIdParams!) {
          getSeasonBySeriesId(GetSeasonBySeriesIdParams: $param) {
            ID
            number
            mediaBasicInfo {
              title
              ID
              plotSummary
            }
          }
        }`,
        { param }
      );
      return result.getSeasonBySeriesId;
    },
    onError: (error) => {
      showGqlError(error.response);
    },
  });
}

export function useCreateEpisode() {
  const { showGqlError } = useGqlError();
  return useMutation({
    mutationFn: async (input: CreateEpisodeInput) => {
      const result = await gqlRequest<{ createEpisode: CommonSuccessOutput }>(
        `mutation($input: CreateEpisodeInput!) {
          createEpisode(CreateEpisodeInput: $input) {
            isSuccess
          }
        }`,
        { input }
      );
      return result.createEpisode;
    },
    onError: (error) => {
      showGqlError(error.response);
    },
  });
}

export function useCreateMediaImage() {
  const { showGqlError } = useGqlError();
  return useMutation({
    mutationFn: async (input: CreateMediaImageInput) => {
      const result = await gqlRequest<{ createMediaImage: MediaImageIdOutput }>(
        `mutation($input: CreateMediaImageInput!) {
          createMediaImage(CreateMediaImageInput: $input) {
            ID
          }
        }`,
        { input }
      );
      return result.createMediaImage;
    },
    onError: (error) => {
      showGqlError(error.response);
    },
  });
}

export function useGetNextEpisodeNumber(param: GetNextEpisodeNumberParams) {
  return useQuery({
    queryKey: [param.SeasonId],
    queryFn: async () => {
      const result = await gqlRequest<{ getNextEpisodeNumber: GetNextEpisodeNumberOutput }>(
        `query($param: GetNextEpisodeNumberParams!) {
          getNextEpisodeNumber(GetNextEpisodeNumberParams: $param) {
            number
          }
        }`,
        { param }
      );
      return result.getNextEpisodeNumber;
    },
  });
}
