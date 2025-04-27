import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAllWebsiteConfigs, deleteWebsiteConfig } from '@/utils/supabase';
import { Pencil, ExternalLink, Trash2, Globe } from 'lucide-react';
import AppNavbar from '@/components/AppNavbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WebsiteConfig {
  id: string;
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  created_at: string;
}

const templates = {
  "cleanslate": "Clean Slate",
  "tradecraft": "Tradecraft",
  "retail": "Retail Ready",
  "service": "Service Pro",
  "expert": "Local Expert"
};

const SavedWebsites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [websiteConfigs, setWebsiteConfigs] = useState<WebsiteConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { t } = useLanguage();

  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.templates'), path: "/templates" },
    { name: t('nav.dashboard'), path: "/dashboard" },
    { name: t('nav.savedwebsites'), path: "/saved-websites" }
  ];
  
  const contactInfo = {
    address: "123 Main Street, City, ST 12345",
    phone: "(555) 123-4567",
    email: "contact@example.com",
  };

  useEffect(() => {
    const loadSavedConfigs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getAllWebsiteConfigs();
        if (data && !error) {
          setWebsiteConfigs(data as WebsiteConfig[]);
        } else if (error) {
          console.error("Error loading website configs:", error);
          toast({
            title: t('errors.title') || "Error",
            description: t('errors.loadWebsites') || "Could not load saved websites",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching website configs:", error);
        toast({
          title: t('errors.title') || "Error",
          description: t('errors.generic') || "Something went wrong while loading your websites",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedConfigs();
  }, [toast, t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewWebsite = (config: WebsiteConfig) => {
    sessionStorage.setItem('companyData', JSON.stringify({
      companyName: config.company_name,
      domainName: config.domain_name,
      logo: config.logo
    }));
    
    navigate(`/${config.template_id}`, { state: { 
      companyName: config.company_name, 
      domainName: config.domain_name, 
      logo: config.logo 
    }});
  };

  const handleDelete = async (websiteId: string) => {
    try {
      setIsDeleting(websiteId);
      const { error } = await deleteWebsiteConfig(websiteId);
      
      if (error) throw error;
      
      setWebsiteConfigs(prev => prev.filter(config => config.id !== websiteId));
      
      toast({
        title: t('websites.deleted') || "Website Deleted",
        description: t('websites.deleteSuccess') || "The website has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: t('errors.title') || "Error",
        description: t('websites.deleteFailed') || "Failed to delete the website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      
      <div className="container py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('nav.savedwebsites') || "Saved Websites"}</h1>
          <Button asChild>
            <Link to="/templates">{t('websites.createNew') || "Create New Website"}</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>{t('common.loading') || "Loading saved websites..."}</p>
          </div>
        ) : websiteConfigs.length === 0 ? (
          <Card className="w-full">
            <CardContent className="py-8">
              <div className="text-center">
                <Globe className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold">{t('websites.noWebsites') || "No websites found"}</h3>
                <p className="mt-1 text-gray-500">{t('websites.noWebsitesDesc') || "You haven't created any websites yet."}</p>
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/templates">{t('websites.createFirst') || "Create Your First Website"}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('websites.company') || "Company"}</TableHead>
                  <TableHead>{t('websites.template') || "Template"}</TableHead>
                  <TableHead>{t('websites.domain') || "Domain"}</TableHead>
                  <TableHead>{t('websites.created') || "Created"}</TableHead>
                  <TableHead className="w-[140px]">{t('websites.actions') || "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websiteConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.company_name}</TableCell>
                    <TableCell>{t(`templates.${config.template_id}.name`) || templates[config.template_id] || config.template_id}</TableCell>
                    <TableCell>{config.domain_name}</TableCell>
                    <TableCell>{formatDate(config.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewWebsite(config)}
                          title={t('websites.view') || "View Website"}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(config.id)}
                          disabled={isDeleting === config.id}
                          title={t('websites.delete') || "Delete Website"}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <Footer 
        logo={t('app.name') || "TemplateBuilder"}
        description={t('app.description') || "Create stunning websites for your clients"}
        basePath=""
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default SavedWebsites;
