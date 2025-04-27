
import React from 'react';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useWebsiteAnalytics } from '@/hooks/useWebsiteAnalytics';

export const WebsiteAnalyticsChart = () => {
  const { data, isLoading } = useWebsiteAnalytics();

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading analytics...</div>;
  }

  return (
    <div className="h-full">
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="template_id" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default WebsiteAnalyticsChart;
