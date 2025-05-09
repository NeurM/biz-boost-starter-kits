
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { getAllWebsiteConfigs } from "@/utils/websiteService";
import GlobalAppNavbar from '@/components/GlobalAppNavbar';
import WebsiteActions from '@/components/website/WebsiteActions';
import { format } from 'date-fns';

const SavedWebsites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWebsites = async () => {
    setIsLoading(true);
    try {
      const { data } = await getAllWebsiteConfigs();
      setWebsites(data || []);
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadWebsites();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const getTemplateDisplayName = (templateId: string) => {
    const templates: Record<string, string> = {
      'tradecraft': 'Tradecraft',
      'retail': 'Retail Ready',
      'service': 'Service Pro',
      'expert': 'Local Expert',
      'cleanslate': 'Clean Slate',
    };
    
    return templates[templateId] || templateId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalAppNavbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Saved Websites</h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : websites.length === 0 ? (
          <Card>
            <CardContent className="py-10 flex flex-col items-center justify-center">
              <p className="text-lg text-gray-600 mb-4">You don't have any saved websites yet.</p>
              <button 
                onClick={() => navigate('/templates')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Create Website
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {website.logo && (
                          <img 
                            src={website.logo} 
                            alt="" 
                            className="w-8 h-8 mr-2 object-contain" 
                          />
                        )}
                        {website.company_name}
                      </div>
                    </TableCell>
                    <TableCell>{website.domain_name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary text-xs rounded-full">
                        {getTemplateDisplayName(website.template_id)}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(website.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <WebsiteActions website={website} onDeleted={loadWebsites} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedWebsites;
