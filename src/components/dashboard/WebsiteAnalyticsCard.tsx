
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WebsiteAnalyticsChart } from "@/components/analytics/WebsiteAnalyticsChart";

const WebsiteAnalyticsCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Website Traffic</CardTitle>
        <CardDescription>
          Visits to your websites in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] p-0 px-2">
        <WebsiteAnalyticsChart />
      </CardContent>
    </Card>
  );
};

export default WebsiteAnalyticsCard;
