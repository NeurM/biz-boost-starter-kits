
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TemplateThemeProvider } from '@/context/TemplateThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CompanyDataProvider } from '@/components/CompanyDataProvider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatProvider } from '@/context/ChatContext';
import { LanguageProvider } from '@/context/LanguageContext';

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <TemplateThemeProvider>
              <CompanyDataProvider>
                <ChatProvider>
                  {children}
                  <Toaster />
                </ChatProvider>
              </CompanyDataProvider>
            </TemplateThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}
