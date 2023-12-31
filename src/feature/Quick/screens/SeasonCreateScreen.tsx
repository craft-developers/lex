import { Stack, Typography } from "@mui/material";
import SeasonCreateForm from "../components/SeasonCreateForm";
import { SeasonCreateFormFieldInterface } from "../types";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Elevator } from "@/components/Tags";
import Button from "@/components/Button";
import { useTranslation } from "react-i18next";
import { SaveIcon } from "@/components/icons";
import { useCreateImage, useCreateSeason, useGetNextSeasonNumber } from "../hooks";
import { extractImageBase64, extractImageMetadata } from "metalyzer";
import { ImageVariantEnum } from "@/types/enum";
import { DEFAULT_PLOT_SUMMARY, DEFAULT_RELEASE_DATE } from "../constants";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function SeasonCreateScreen() {
  const { t } = useTranslation();
  const params = useParams();
  const { data: nextSeasonNumberData } = useGetNextSeasonNumber({ SeriesId: params.seriesId! });
  const { mutateAsync: createSeasonMutateAsync, isPending: isCreateSeasonLoading } = useCreateSeason();
  const { mutateAsync: createImageMutateAsync, isPending: isCreateImageLoading } = useCreateImage();

  useEffect(() => {
    if (nextSeasonNumberData) {
      setSeasonFormValue("number", nextSeasonNumberData.number);
    }
  }, [nextSeasonNumberData]);

  const {
    control,
    formState: { errors },
    register,
    watch: seasonFormWatch,
    handleSubmit: handleOnSubmit,
    setValue: setSeasonFormValue,
  } = useForm<SeasonCreateFormFieldInterface>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      plotSummary: DEFAULT_PLOT_SUMMARY,
      releaseDate: DEFAULT_RELEASE_DATE,
      number: nextSeasonNumberData?.number,
    },
  });

  const handleOnImageSelect = async (image: File) => {
    const { mimeType } = await extractImageMetadata(image);
    const imageBase64 = await extractImageBase64(image);
    const result = await createImageMutateAsync({ Base64: imageBase64, Mime: mimeType, Variant: ImageVariantEnum.BACKDROP });
    if (result) {
      setSeasonFormValue("imageId", result.ID);
    }
  };

  const handleOnCreateEpisode = async (input: SeasonCreateFormFieldInterface) => {
    await createSeasonMutateAsync({
      ImageId: input.imageId,
      MediaBasicInfo: {
        PlotSummary: input.plotSummary,
        Title: input.title,
        ReleaseDate: +input.releaseDate,
      },
      Number: input.number,
      SeriesId: params.seriesId!,
    });
    window.close();
  };

  const pageHeader = (
    <Elevator p={2} justifyContent={"space-between"} direction={"row"} gap={1} alignItems={"center"}>
      <Typography variant="h5">{t("Feature.Quick.SeasonCreateScreen.createASeason")}</Typography>
      <Stack direction={"row"} gap={1}>
        <Button variant="text">{t("Feature.Quick.SeasonCreateScreen.back")}</Button>
        <Button loading={isCreateSeasonLoading} endIcon={<SaveIcon />} variant="contained" onClick={handleOnSubmit(handleOnCreateEpisode)}>
          {t("Feature.Quick.SeasonCreateScreen.save")}
        </Button>
      </Stack>
    </Elevator>
  );

  return (
    <Stack>
      {pageHeader}
      <SeasonCreateForm control={control} errors={errors} register={register} onImageSelect={handleOnImageSelect} isLoading={isCreateImageLoading} watch={seasonFormWatch} />
    </Stack>
  );
}

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  plotSummary: yup.string().required("Plot summary is required"),
  number: yup.number().required("Plot summary is required").min(1),
  releaseDate: yup.number().required("Release date is required"),
  imageId: yup.string().required("Backdrop is required"),
});
