import { Card, LinearProgress, Stack, SxProps, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import useThemeStyles from "@/theme/hooks/useThemeStyles";
import { UploadIcon } from "@/components/icons";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@/components/ProgressBars";

interface SeriesImageSelectComponentProps {
  onImageDrop: (image: File) => void;
  isLoading: boolean;
}

export default function SeriesImageSelectComponent({ onImageDrop, isLoading }: SeriesImageSelectComponentProps) {
  const { t } = useTranslation();
  const onDrop = ([video]: File[]) => {
    onImageDrop(video);
  };

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const containerStyle = useThemeStyles<SxProps>((theme) => ({
    height: theme.spacing(16),
    pointerEvents: isLoading ? "none" : "all",
    padding: theme.spacing(1),
  }));

  const dropzoneStyle = useThemeStyles<SxProps>((theme) => ({
    border: isDragActive ? `2px dashed ${theme.palette.primary.main}` : "none",
    color: isDragActive ? theme.palette.primary.main : theme.palette.text.primary,
  }));

  return (
    <Card {...getRootProps()} sx={containerStyle}>
      <Stack alignItems={"center"} justifyContent={"center"} height={"100%"} sx={dropzoneStyle} gap={2}>
        <UploadIcon fontSize="medium" />
        <Typography variant="body1">{t("Feature.SeriesManagement.SeriesImageSelectComponent.title")}</Typography>
      </Stack>
      <LinearProgress value={50} variant="buffer" />
    </Card>
  );
}
