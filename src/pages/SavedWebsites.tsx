
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAllWebsiteConfigs } from '@/utils/supabase';
import { Pencil, ExternalLink, Trash2, Globe } from 'lucide-react';
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
            title: "Error",
            description: "Could not load saved websites",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching website configs:", error);
        toast({
          title: "Error",
          description: "Something went wrong while loading your websites",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedConfigs();
  }, [toast]);

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

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Saved Websites</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading saved websites...</p>
        </div>
      </div>
    );
  }

  if (websiteConfigs.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Saved Websites</h1>
        <Card className="w-full">
          <CardContent className="py-8">
            <div className="text-center">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold">No websites found</h3>
              <p className="mt-1 text-gray-500">You haven't created any websites yet.</p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/">Create Your First Website</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Saved Websites</h1>
        <Button asChild>
          <Link to="/">Create New Website</Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websiteConfigs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="font-medium">{config.company_name}</TableCell>
                <TableCell>{templates[config.template_id] || config.template_id}</TableCell>
                <TableCell>{config.domain_name}</TableCell>
                <TableCell>{formatDate(config.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewWebsite(config)}
                      title="View Website"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SavedWebsites;
