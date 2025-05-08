
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary'; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TemplateThemeProvider } from "@/context/TemplateThemeContext";
import { CompanyDataProvider } from "@/context/CompanyDataContext";
import { Toaster } from "@/components/ui/toaster";

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="text-center p-6 bg-red-50 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
      <p className="text-gray-700 mb-4">An error occurred in the application.</p>
      <div className="bg-red-100 p-4 rounded-lg mb-4 max-w-lg overflow-auto text-left">
        <p className="font-medium text-red-800">{error.message}</p>
        <p className="text-sm text-red-700 mt-2">{error.stack?.split('\n')[0]}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
};

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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
