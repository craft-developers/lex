import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainStack from "./navigation/Main.routes";
import { I18nextProvider } from "react-i18next";
import { i18n } from "./i18n";
import { ThemeProvider } from "./theme/Theme.context";
import "./i18n";
import { UserDetailProvider } from "./context/UserDetail.context";
import { AuthContextProvider } from "./context/AuthContext";
import { GqlErrorProvider } from "./context/GqlErrorContext";
import { LocalizationProvider, LicenseInfo as DatePickerLicenseInfo } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { LicenseInfo as DataGridLicenseInfo } from "@mui/x-data-grid-pro";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
    mutations: {},
  },
});

DataGridLicenseInfo.setLicenseKey('76c34ab47f811b623345476a6f326e4aTz01NzA5OSxFPTE3MDQ0NzYyNjQyODMsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
DatePickerLicenseInfo.setLicenseKey('76c34ab47f811b623345476a6f326e4aTz01NzA5OSxFPTE3MDQ0NzYyNjQyODMsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        <I18nextProvider i18n={i18n}>
          <AuthContextProvider>
            <ThemeProvider>
              <UserDetailProvider>
                <GqlErrorProvider>
                  <MainStack />
                </GqlErrorProvider>
              </UserDetailProvider>
            </ThemeProvider>
          </AuthContextProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
