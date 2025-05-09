
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
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
  
  const getTemplateBgClass = (templateId: string) => {
    const templates: Record<string, string> = {
      'tradecraft': 'bg-blue-50',
      'retail': 'bg-purple-50',
      'service': 'bg-teal-50',
      'expert': 'bg-yellow-50',
      'cleanslate': 'bg-gray-50',
    };
    
    return templates[templateId] || 'bg-gray-50';
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((website) => (
              <Card key={website.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-24 ${getTemplateBgClass(website.template_id)} flex items-center justify-center`}>
                  {website.logo ? (
                    <img src={website.logo} alt={website.company_name} className="h-16 object-contain" />
                  ) : (
                    <span className="text-xl font-semibold">{website.company_name}</span>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{website.company_name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{website.domain_name}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-secondary text-xs rounded-full">
                          {getTemplateDisplayName(website.template_id)}
                        </span>
                        {website.color_scheme && (
                          <span 
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: `var(--${website.color_scheme}-500, #3b82f6)` }}
                          >
                            {website.color_scheme}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Created: {format(new Date(website.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <WebsiteActions website={website} onDeleted={loadWebsites} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedWebsites;
