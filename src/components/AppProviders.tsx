
import React from 'react';
import { TemplateThemeProvider } from '@/context/TemplateThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CompanyDataProvider } from '@/context/CompanyDataContext';
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
      <LanguageProvider>
        {/* Important: TemplateThemeProvider must come before AuthProvider to avoid circular dependencies */}
        <TemplateThemeProvider>
          <ChatProvider>
            <AuthProvider>
              <CompanyDataProvider>
                {children}
                <Toaster />
              </CompanyDataProvider>
            </AuthProvider>
          </ChatProvider>
        </TemplateThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
