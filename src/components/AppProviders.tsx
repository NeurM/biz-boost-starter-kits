
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./ui/toaster";
import CompanyDataProvider from "./CompanyDataProvider";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyDataProvider>
        {children}
        <Toaster />
      </CompanyDataProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
