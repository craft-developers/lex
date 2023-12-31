import Snackbar from "@/components/Snackbar";
import { createContext, useContext, useState, ReactNode } from "react";

interface GqlErrorContextProps {
  showGqlError: (error: ServerErrorResponse) => void;
}

const GqlErrorContext = createContext<GqlErrorContextProps | undefined>(undefined);

interface GqlErrorProviderProps {
  children: ReactNode;
}

export function GqlErrorProvider({ children }: GqlErrorProviderProps) {
  const [gqlError, setGqlError] = useState<GqlError | null>(null);

  const showGqlError = (error: ServerErrorResponse) => {
    const err = error.response.errors[0];
    setGqlError(err);
  };

  const handleClose = () => {
    setGqlError(null);
  };

  return (
    <GqlErrorContext.Provider value={{ showGqlError }}>
      {children}
      <Snackbar open={!!gqlError} onClose={handleClose} message={gqlError?.message} AlertProps={{ onClose: handleClose }} />
    </GqlErrorContext.Provider>
  );
}

export default function useGqlError(): GqlErrorContextProps {
  const context = useContext(GqlErrorContext);

  if (!context) {
    throw new Error("useGqlError must be used within a GqlErrorProvider");
  }

  return context;
}
