
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getWebsiteConfig } from '@/utils/supabase';
import { useToast } from '@/hooks/use-toast';

interface CompanyData {
  companyName: string;
  domainName: string;
  logo: string;
}

const CompanyDataContext = createContext<{
  companyData: CompanyData | null;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyData | null>>;
}>({
  companyData: null,
  setCompanyData: () => {}
});

export const useCompanyData = () => useContext(CompanyDataContext);

interface CompanyDataProviderProps {
  children: ReactNode;
}

export const CompanyDataProvider = ({ children }: CompanyDataProviderProps) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        // Get template ID from URL
        const templateId = location.pathname.split('/')[1];
        if (!templateId) return;
        
        // First try to load from session storage (for non-logged in users or preview)
        const storedData = sessionStorage.getItem('companyData');
        if (storedData) {
          setCompanyData(JSON.parse(storedData));
          return;
        }

        // Then try to get from location state
        if (location.state) {
          const { companyName, domainName, logo } = location.state;
          if (companyName && domainName && logo) {
            const newData = { companyName, domainName, logo };
            setCompanyData(newData);
            // Store in session storage for persistence
            sessionStorage.setItem('companyData', JSON.stringify(newData));
            return;
          }
        }
        
        // If no session data and no location state, try loading from Supabase
        // This will get the configuration for the current template and user
        const { data, error } = await getWebsiteConfig(templateId);
        if (data && !error) {
          const newData = {
            companyName: data.company_name,
            domainName: data.domain_name,
            logo: data.logo
          };
          setCompanyData(newData);
          // Store in session storage for quick access in future
          sessionStorage.setItem('companyData', JSON.stringify(newData));
        } else if (error) {
          console.error("Error loading website config:", error);
          toast({
            title: "Error",
            description: "Could not load website configuration",
            variant: "destructive",
          });
        } else {
          // If neither session storage nor location state nor database has data, reset to null
          setCompanyData(null);
        }
      } catch (error) {
        console.error("Error in CompanyDataProvider:", error);
        toast({
          title: "Error",
          description: "Something went wrong loading website data",
          variant: "destructive",
        });
      }
    };
    
    loadCompanyData();
  }, [location, toast]);

  return (
    <CompanyDataContext.Provider value={{ companyData, setCompanyData }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

export default CompanyDataProvider;
