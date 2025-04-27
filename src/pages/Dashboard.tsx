
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ApiAnalyticsChart } from "@/components/analytics/ApiAnalyticsChart";
import { WebsiteAnalyticsChart } from "@/components/analytics/WebsiteAnalyticsChart";
import WebsiteVisitAnalytics from "@/components/analytics/WebsiteVisitAnalytics";
import AppNavbar from '@/components/AppNavbar';

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
    <div className="container mx-auto py-10">
      <AppNavbar />
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>
              Number of API calls in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ApiAnalyticsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>
              Visits to your websites in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <WebsiteAnalyticsChart />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Website Visit Analytics</CardTitle>
          <CardDescription>
            Detailed breakdown of visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <WebsiteVisitAnalytics />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
