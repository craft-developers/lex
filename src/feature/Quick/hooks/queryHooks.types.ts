import { MediaCountriesEnum, LanguagiesEnum, MediaGenriesEnum, ImageVariantEnum, MediaStatusEnum, CineastProfessionEnum, GenderEnum } from "@/types/enum";

export type CreateImageInput = {
  Base64: string;
  Mime: string;
  Variant: ImageVariantEnum;
};

export type CreateSeriesInput = {
  ImageId: string;
  MediaBasicInfo: CreateMediaBasicInfoInput;
  MediaAdditionalInfo: MediaAdditionalInfoInput;
};

export type CreateSeasonInput = {
  MediaBasicInfo: CreateMediaBasicInfoInput;
  ImageId: string;
  Number: number;
  SeriesId: string;
};

export type CreateCineastInput = {
  ImageId: string;
  FullName: string;
  Profession: CineastProfessionEnum;
  DateOfBirth: number;
  Bio: string;
  Gender: GenderEnum;
  Country: MediaCountriesEnum;
  Award: string[];
};

export type MediaAdditionalInfoInput = {
  OriginCountry?: MediaCountriesEnum;
  OriginalLanguage?: LanguagiesEnum;
  Genre?: MediaGenriesEnum;
  Status?: MediaStatusEnum;
};

export type CreateMediaBasicInfoInput = {
  Title: string;
  PlotSummary: string;
  ReleaseDate: number;
};

export type GetNextSeasonNumberParams = {
  SeriesId: string;
};

export type ImageIdOutput = {
  ID: string;
};

export type GetNextSeasonNumberOutput = {
  number: number;
};
