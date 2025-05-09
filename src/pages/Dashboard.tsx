
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import ApiAnalyticsCard from "@/components/dashboard/ApiAnalyticsCard";
import WebsiteAnalyticsCard from "@/components/dashboard/WebsiteAnalyticsCard";
import WebsiteVisitAnalytics from "@/components/dashboard/WebsiteVisitAnalytics";
import DeploymentInfo from "@/components/dashboard/DeploymentInfo";
import CodeDownloader from "@/components/dashboard/CodeDownloader";
import GlobalAppNavbar from '@/components/GlobalAppNavbar';
import { getAllWebsiteConfigs } from '@/utils/websiteService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<any[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Load the user's website configs
    const loadWebsiteConfigs = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllWebsiteConfigs();
        if (data && data.length > 0) {
          setWebsites(data);
          // Set the first website as default selected
          setSelectedWebsiteId(data[0].id);
        }
      } catch (error) {
        console.error('Error loading website configs:', error);
        toast({
          title: "Error",
          description: "Failed to load your websites",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWebsiteConfigs();
  }, [user, navigate, toast]);

  // Get the currently selected website config
  const selectedWebsite = websites.find(site => site.id === selectedWebsiteId);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalAppNavbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {websites.length > 0 && (
          <div className="mb-6">
            <Label htmlFor="website-selector">Select Website to Deploy</Label>
            <Select
              value={selectedWebsiteId || ""}
              onValueChange={(value) => setSelectedWebsiteId(value)}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a website" />
              </SelectTrigger>
              <SelectContent>
                {websites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.company_name} ({site.template_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ApiAnalyticsCard />
          <WebsiteAnalyticsCard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DeploymentInfo websiteConfig={selectedWebsite} />
          <CodeDownloader websiteConfig={selectedWebsite} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Visit Analytics</CardTitle>
            <CardDescription>
              Detailed breakdown of visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WebsiteVisitAnalytics 
              websiteId={selectedWebsiteId || "main-website"}
              websiteName={selectedWebsite?.company_name || "Primary Website"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
