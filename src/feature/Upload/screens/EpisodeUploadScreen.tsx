import { useRef, useState } from "react";
import { EpisodeUploadModal, EpisodeUploadModalRef, SelectSeriesAndSeasonModal } from "../components";
import { useCreateEpisode, useCreateImage, useGetUploadVideoSignedUrl, useUploadVideoOnAwsS3 } from "../hooks";
import { extractImageBase64, extractImageMetadata, extractImageUrl, extractThumbnailFromVideo, extractVideoMetadata, convertVideoInBlob } from "metalyzer";
import { ImageVariantEnum, MovierMediaEnum } from "@/types/enum";
import Button from "@/components/Button";
import Page from "@/components/Page";
import { CreateEpisodeFormFieldType } from "../types";
import { VideoShareModal } from "@/AddtionalFeatures/VideoShare";

export default function EpisodeUploadScreen() {
  const episodeUploadModalRef = useRef<EpisodeUploadModalRef>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [isFeedbackSidebarVisible, setIsFeedbackSidebarVisible] = useState(false);
  const [isSelectSeriesModalVisible, setIsSelectSeriesModalVisible] = useState(true);
  const [isEpisodeUploadModalVisible, setIsEpisodeUploadModalVisible] = useState(true);
  const [isVideoShareModalVisible, setIsVideoShareModalVisible] = useState(false);
  const { mutateAsync: getUploadEpisodeUrlMutateAsync, isPending: isGetUploadEpisodeUrlLoading, data: getSignedUrlData } = useGetUploadVideoSignedUrl();
  const { mutateAsync: uploadVideoOnAwsS3MutateAsync, progress: episodeUploadProgress } = useUploadVideoOnAwsS3();
  const { mutateAsync: createImageMutateAsync, data: imageData, isPending: isCreateImageLoading } = useCreateImage();
  const { mutateAsync: createEpisodeMutateAsync, isPending: isCreateEpisodeLoading, data: createEpisodeData } = useCreateEpisode();

  const handleOnEpisodeDrop = async (episode: File) => {
    const episodeMetadata = await extractVideoMetadata(episode);
    const result = await getUploadEpisodeUrlMutateAsync({
      Height: episodeMetadata.videoHeight!,
      Width: episodeMetadata.videoWidth!,
      MediaType: MovierMediaEnum.EPISODE,
      Mime: episodeMetadata.mimeType,
      RunTime: episodeMetadata.videoDuration,
      SizeInKb: episodeMetadata.fileSizeKB,
    });
    episodeUploadModalRef.current?.onNext();
    handleOnThumbnailSelect(await extractThumbnailFromVideo(episode));
    handleOnUploadOnAwsS3(episode, result?.signedUrl!);
  };

  const handleOnCreateEpisode = async (input: CreateEpisodeFormFieldType) => {
    await createEpisodeMutateAsync({
      Number: input.number,
      ImageId: imageData?.ID,
      SeasonId: selectedSeasonId,
      SignedUrlKeyId: getSignedUrlData?.signedUrlKeyId,
      VideoId: getSignedUrlData?.videoId,
      MediaBasicInfo: {
        PlotSummary: input.plotSummary,
        Title: input.title,
        ReleaseDate: input.releaseDate,
      },
    });
    handleOnToggleVideoShareModalVisible()
    handleOnToggleEpisodeUploadModal();
  };

  const handleOnThumbnailSelect = async (image: File) => {
    const { mimeType } = await extractImageMetadata(image);
    const imageBase64 = await extractImageBase64(image);
    setThumbnailUrl(await extractImageUrl(image));
    await createImageMutateAsync({ Base64: imageBase64, Mime: mimeType, Variant: ImageVariantEnum.THUMBNAIL });
  };
  
  const handleOnUploadOnAwsS3 = async (episode: File, signedUrl: string) => {
    const videoBlob = await convertVideoInBlob(episode);
    await uploadVideoOnAwsS3MutateAsync({ SignedUrl: signedUrl, VideoBlob: videoBlob });
  };

  const handleOnToggleEpisodeUploadModal = () => {
    setIsEpisodeUploadModalVisible(!isEpisodeUploadModalVisible);
  };

  const handleOnToggleSelectSeriesModalVisible = () => {
    setIsSelectSeriesModalVisible(!isEpisodeUploadModalVisible);
    handleOnToggleEpisodeUploadModal();
  };

  const handleOnToggleFeedbackSidebar = () => {
    setIsFeedbackSidebarVisible(!isFeedbackSidebarVisible);
  };

  const handleOnToggleVideoShareModalVisible = () => {
    setIsVideoShareModalVisible(!isVideoShareModalVisible);
  };

  const handleOnNextSelectSeriesAndSeasonModal = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    setIsSelectSeriesModalVisible(!isEpisodeUploadModalVisible);
  };

  return (
    <Page>
      <Button onClick={handleOnToggleSelectSeriesModalVisible}>Upload</Button>
      <EpisodeUploadModal
        isVisible={isEpisodeUploadModalVisible}
        onClose={handleOnToggleEpisodeUploadModal}
        onEpisodeSelect={handleOnEpisodeDrop}
        isLoading={isCreateImageLoading || isGetUploadEpisodeUrlLoading || isCreateEpisodeLoading}
        onFeedback={handleOnToggleFeedbackSidebar}
        onThumbnailSelect={handleOnThumbnailSelect}
        onCreateEpisode={handleOnCreateEpisode}
        thumbnailUrl={thumbnailUrl}
        ref={episodeUploadModalRef}
        seasonId={selectedSeasonId}
        episodeId={createEpisodeData?.ID}
        progress={episodeUploadProgress}
      />
      <SelectSeriesAndSeasonModal onNext={handleOnNextSelectSeriesAndSeasonModal} isVisible={isSelectSeriesModalVisible} onClose={handleOnToggleSelectSeriesModalVisible} />
      <VideoShareModal mediaId={createEpisodeData?.ID} mediaType={MovierMediaEnum.EPISODE} isVisible={isVideoShareModalVisible} onClose={handleOnToggleVideoShareModalVisible} />
    </Page>
  );
}
