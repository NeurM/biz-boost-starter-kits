
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext';
import { CompanyDataProvider } from '../context/CompanyDataContext';
import { TemplateThemeProvider } from '../context/TemplateThemeContext';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <CompanyDataProvider>
              <TemplateThemeProvider>
                {children}
              </TemplateThemeProvider>
            </CompanyDataProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
