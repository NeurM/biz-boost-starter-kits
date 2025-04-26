
import React from 'react';
import { WebsiteAnalyticsChart } from '@/components/dashboard/WebsiteAnalyticsChart';
import { ApiAnalyticsChart } from '@/components/dashboard/ApiAnalyticsChart';

const Dashboard = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <WebsiteAnalyticsChart />
        <ApiAnalyticsChart />
      </div>
    </div>
  );
};

export default Dashboard;
