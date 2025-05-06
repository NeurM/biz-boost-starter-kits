
import React from 'react';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useApiAnalytics } from '@/hooks/useApiAnalytics';

export const ApiAnalyticsChart = () => {
  const { data, isLoading } = useApiAnalytics();

  if (isLoading) {
    return <div className="flex items-center justify-center h-[260px]">Loading analytics...</div>;
  }

  return (
    <div className="h-[260px] w-full px-2 py-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="endpoint" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <ChartTooltip />
          <Bar dataKey="count" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApiAnalyticsChart;
