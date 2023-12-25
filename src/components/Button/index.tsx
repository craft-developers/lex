import { ButtonProps as MuiButtonProps, Button as MuiButton } from "@mui/material";
import { CircularProgress } from "../ProgressBars";

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export default function Button({ variant = "outlined", startIcon, endIcon, children, loading, ...restProps }: ButtonProps) {
  return (
    <MuiButton variant={variant} disabled={loading} {...restProps} startIcon={startIcon && loading ? <CircularProgress size={15} color="inherit" /> : startIcon} endIcon={endIcon && loading ? <CircularProgress size={15} color="inherit" /> : endIcon}>
      {children}
    </MuiButton>
  );
}
