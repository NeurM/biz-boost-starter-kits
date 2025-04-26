
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TemplateThemeProvider } from "@/context/TemplateThemeContext";
import { CompanyDataProvider } from "@/context/CompanyDataContext";
import { Toaster } from "@/components/ui/toaster";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TemplateThemeProvider>
            <CompanyDataProvider>
              {children}
              <Toaster />
            </CompanyDataProvider>
          </TemplateThemeProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};
