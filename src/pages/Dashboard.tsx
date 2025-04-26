
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface WebsiteAnalytics {
  template_id: string;
  count: number;
}

interface ApiLogAnalytics {
  endpoint: string;
  count: number;
}

const Dashboard = () => {
  const { toast } = useToast();

  const { data: websiteAnalytics, isLoading: isLoadingWebsites } = useQuery({
    queryKey: ['website-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_configs')
        .select('template_id')
        .filter('user_id', 'eq', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        toast({
          title: "Error loading website analytics",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      const analytics = data.reduce((acc: WebsiteAnalytics[], curr) => {
        const existing = acc.find(a => a.template_id === curr.template_id);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ template_id: curr.template_id, count: 1 });
        }
        return acc;
      }, []);

      return analytics;
    }
  });

  const { data: apiAnalytics, isLoading: isLoadingApi } = useQuery({
    queryKey: ['api-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_logs')
        .select('endpoint')
        .filter('user_id', 'eq', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        toast({
          title: "Error loading API analytics",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      const analytics = data.reduce((acc: ApiLogAnalytics[], curr) => {
        const existing = acc.find(a => a.endpoint === curr.endpoint);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ endpoint: curr.endpoint, count: 1 });
        }
        return acc;
      }, []);

      return analytics;
    }
  });

  if (isLoadingWebsites || isLoadingApi) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Websites by Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={websiteAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="template_id" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage by Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apiAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
