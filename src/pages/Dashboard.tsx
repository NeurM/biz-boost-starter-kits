
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import ApiAnalyticsCard from "@/components/dashboard/ApiAnalyticsCard";
import WebsiteAnalyticsCard from "@/components/dashboard/WebsiteAnalyticsCard";
import WebsiteVisitAnalytics from "@/components/dashboard/WebsiteVisitAnalytics";
import DeploymentInfo from "@/components/dashboard/DeploymentInfo";
import GlobalAppNavbar from '@/components/GlobalAppNavbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalAppNavbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ApiAnalyticsCard />
          <WebsiteAnalyticsCard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DeploymentInfo />
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
              websiteId="main-website"
              websiteName="Primary Website"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
