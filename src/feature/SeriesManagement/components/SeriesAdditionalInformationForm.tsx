import Elevator from "@/components/Tags/Elevator";
import { Stack, Typography } from "@mui/material";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SeriesCreateFormFieldInterface } from "../types";
import { useState } from "react";
import { CountriesEnum, LanguagiesEnum, GenriesEnum } from "@/types/enum";
import { ModalSelectInput } from "@/components/Form";
import { CountryPickerModal, LanguagePickerModal, GenrePickerModal } from "@/components/Modals";
import SeriesStatusSelectComponent from "./SeriesStatusSelectComponent";

interface SeriesAdditionalInformationFormProps {
  setCreateSeriesFormValue: UseFormSetValue<SeriesCreateFormFieldInterface>;
  watchCreateSeriesFormValue: UseFormWatch<SeriesCreateFormFieldInterface>;
}

export default function SeriesAdditionalInformationForm({ setCreateSeriesFormValue, watchCreateSeriesFormValue }: SeriesAdditionalInformationFormProps) {
  const { t } = useTranslation();
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isGenreModalVisible, setIsGenreModalVisible] = useState(false);

  const handleOnSelectCountry = (countrName: CountriesEnum) => {
    setCreateSeriesFormValue("originCountry", countrName);
    handleOnToggleCountryModalVisible();
  };

  const handleOnSelectGenre = (genre: GenriesEnum) => {
    setCreateSeriesFormValue("genre", genre);
    handleOnToggleGenreModalVisible();
  };

  const handleOnSelectLanguage = (language: LanguagiesEnum) => {
    setCreateSeriesFormValue("originalLanguage", language);
    handleOnToggleLanguageModalVisible();
  };

  const handleOnToggleCountryModalVisible = () => {
    setIsCountryModalVisible(!isCountryModalVisible);
  };

  const handleOnToggleGenreModalVisible = () => {
    setIsGenreModalVisible(!isGenreModalVisible);
  };

  const handleOnToggleLanguageModalVisible = () => {
    setIsLanguageModalVisible(!isLanguageModalVisible);
  };

  return (
    <Elevator padding={4} gap={2}>
      <Typography variant="h5">{t("Feature.SeriesManagement.SeriesAdditionalInformationForm.addAdditionalInformation")}</Typography>
      <Stack direction={{ md: "row", sm: "column" }} gap={2}>
        <ModalSelectInput isModalVisible={isCountryModalVisible} label={t("Feature.SeriesManagement.SeriesAdditionalInformationForm.originCountry")} value={watchCreateSeriesFormValue("originCountry")} onClick={handleOnToggleCountryModalVisible} fullWidth />
        <CountryPickerModal isOpen={isCountryModalVisible} onClose={handleOnToggleCountryModalVisible} onOk={handleOnSelectCountry} />
        <ModalSelectInput isModalVisible={isLanguageModalVisible} label={t("Feature.SeriesManagement.SeriesAdditionalInformationForm.originalLanguage")} value={watchCreateSeriesFormValue("originalLanguage")} onClick={handleOnToggleLanguageModalVisible} fullWidth />
        <LanguagePickerModal isOpen={isLanguageModalVisible} onClose={handleOnToggleLanguageModalVisible} onOk={handleOnSelectLanguage} />
      </Stack>
      <Stack direction={{ md: "row", sm: "column" }} gap={2}>
        <ModalSelectInput isModalVisible={isGenreModalVisible} label={t("Feature.SeriesManagement.SeriesAdditionalInformationForm.pickAGenre")} value={watchCreateSeriesFormValue("genre")} onClick={handleOnToggleGenreModalVisible} fullWidth />
        <GenrePickerModal isOpen={isGenreModalVisible} onClose={handleOnToggleGenreModalVisible} onOk={handleOnSelectGenre} />
        <SeriesStatusSelectComponent setCreateSeriesFormValue={setCreateSeriesFormValue} watchCreateSeriesFormValue={watchCreateSeriesFormValue} />
      </Stack>
    </Elevator>
  );
}
