
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface WebsiteConfig {
  id: string;
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
  deployment_status?: string;
  deployment_url?: string;
  last_deployed_at?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<WebsiteConfig[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check if there's a website ID in session storage (from WebsiteActions)
    const storedWebsiteId = sessionStorage.getItem('selectedWebsiteId');
    if (storedWebsiteId) {
      setSelectedWebsiteId(storedWebsiteId);
      sessionStorage.removeItem('selectedWebsiteId'); // Clear it after using
      setActiveTab("deployment"); // Switch to deployment tab automatically
    }
    
    // Load the user's website configs
    const loadWebsiteConfigs = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllWebsiteConfigs();
        if (data && data.length > 0) {
          setWebsites(data);
          // Set the first website as default selected if no stored website ID
          if (!storedWebsiteId) {
            setSelectedWebsiteId(data[0].id);
          }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <GlobalAppNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {isLoading ? (
          <div className="mb-6">
            <Skeleton className="h-10 w-full max-w-md mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            {websites.length > 0 ? (
              <div className="mb-6">
                <Label htmlFor="website-selector" className="text-base font-semibold mb-2 block">
                  Select Website
                </Label>
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
            ) : (
              <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
                <CardContent className="pt-6">
                  <p>You don't have any websites yet. Create one from the templates page.</p>
                </CardContent>
              </Card>
            )}

            {selectedWebsite && (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Analytics</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ApiAnalyticsCard />
                    <WebsiteAnalyticsCard />
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
                </TabsContent>
                
                <TabsContent value="deployment">
                  <DeploymentInfo websiteConfig={selectedWebsite} />
                </TabsContent>
                
                <TabsContent value="code">
                  <CodeDownloader websiteConfig={selectedWebsite} />
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
