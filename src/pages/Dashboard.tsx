
import React, { useState, useEffect } from 'react';
import { WebsiteAnalyticsChart } from '@/components/dashboard/WebsiteAnalyticsChart';
import { ApiAnalyticsChart } from '@/components/dashboard/ApiAnalyticsChart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import WebsiteVisitAnalytics from '@/components/dashboard/WebsiteVisitAnalytics';
import { supabase } from '@/integrations/supabase/client';

// Define the website config type
interface WebsiteConfig {
  id: string;
  company_name: string;
  template_id: string;
  domain_name: string;
  created_at: string;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
  const [websites, setWebsites] = useState<WebsiteConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch saved websites
  useEffect(() => {
    const fetchWebsites = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('website_configs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setWebsites(data);
          // Select the first website by default
          if (data.length > 0 && !selectedWebsite) {
            setSelectedWebsite(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching websites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebsites();
  }, [user]);
  
  // Define navigation and contact info for the navbar and footer
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

  // Find the selected website
  const selectedWebsiteData = websites.find(website => website.id === selectedWebsite);

  // Sample data for overview stats
  const overviewStats = [
    { title: t('dashboard.websites') || "Active Websites", value: websites.length.toString() },
    { title: t('dashboard.visitors') || "Monthly Visitors", value: "1.2k" },
    { title: t('dashboard.apiCalls') || "API Calls", value: "8.5k" },
    { title: t('dashboard.uptime') || "Uptime", value: "99.9%" },
  ];
  
  // Sample recent activity
  const recentActivity = [
    { 
      type: "website", 
      title: "ServicePro website created", 
      time: "2 hours ago", 
      url: "/service",
      status: "active"
    },
    { 
      type: "visitor", 
      title: "Spike in traffic detected", 
      time: "Yesterday", 
      url: "/dashboard",
      status: "info" 
    },
    { 
      type: "api", 
      title: "API usage above average", 
      time: "3 days ago", 
      url: "/dashboard",
      status: "warning" 
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        logo={t('app.name') || "TemplateBuilder"}
        basePath=""
        navItems={navItems}
        ctaText={t('cta.getstarted')}
        ctaLink={"/auth"}
      />
      
      <div className="container py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title') || "Analytics Dashboard"}</h1>
            <p className="text-gray-600 mt-1">{t('dashboard.welcome') || "Welcome back"}, {user?.email?.split('@')[0] || "User"}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button asChild variant="outline">
              <Link to="/templates">{t('dashboard.createWebsite') || "Create New Website"}</Link>
            </Button>
            <Button asChild>
              <Link to="/saved-websites">{t('dashboard.manageWebsites') || "Manage Websites"}</Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t('dashboard.overview') || "Overview"}</TabsTrigger>
            <TabsTrigger value="analytics">{t('dashboard.analytics') || "Analytics"}</TabsTrigger>
            <TabsTrigger value="website-analytics">{t('dashboard.websiteAnalytics') || "Website Analytics"}</TabsTrigger>
            <TabsTrigger value="activity">{t('dashboard.activity') || "Recent Activity"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Recent activity preview */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.recentActivity') || "Recent Activity"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentActivity.slice(0, 3).map((activity, index) => (
                    <li key={index} className="flex items-start justify-between border-b last:border-0 pb-3 last:pb-0">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <Badge variant={activity.status === "active" ? "default" : 
                              activity.status === "warning" ? "destructive" : "outline"}>
                        {activity.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Quick access */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickAccess') || "Quick Access"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/templates">Templates</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/saved-websites">Saved Websites</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth">Account Settings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">{t('dashboard.websiteAnalytics') || "Website Analytics"}</h2>
            <Card>
              <CardContent className="pt-6">
                <WebsiteAnalyticsChart />
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">{t('dashboard.apiAnalytics') || "API Analytics"}</h2>
            <Card>
              <CardContent className="pt-6">
                <ApiAnalyticsChart />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="website-analytics">
            {websites.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Website</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {websites.map(website => (
                        <Button
                          key={website.id}
                          variant={selectedWebsite === website.id ? "default" : "outline"}
                          className="h-auto py-3 justify-start"
                          onClick={() => setSelectedWebsite(website.id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{website.company_name}</span>
                            <span className="text-xs text-gray-500 mt-1">{website.template_id}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {selectedWebsiteData && (
                  <WebsiteVisitAnalytics 
                    websiteId={selectedWebsiteData.id}
                    websiteName={selectedWebsiteData.company_name}
                  />
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="mb-4 text-gray-600">You don't have any websites yet.</p>
                    <Button asChild>
                      <Link to="/templates">Create Your First Website</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.fullActivityLog') || "Activity Log"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[...recentActivity, ...recentActivity].map((activity, index) => (
                    <li key={index} className="flex items-start justify-between border-b last:border-0 pb-3 last:pb-0">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <Badge variant={activity.status === "active" ? "default" : 
                              activity.status === "warning" ? "destructive" : "outline"}>
                        {activity.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

export default Dashboard;
