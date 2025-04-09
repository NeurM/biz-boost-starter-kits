
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

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

  useEffect(() => {
    // First try to load from session storage
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
      }
    }
  }, [location]);

  return (
    <CompanyDataContext.Provider value={{ companyData, setCompanyData }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

export default CompanyDataProvider;
