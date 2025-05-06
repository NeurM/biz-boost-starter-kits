
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WebsiteAnalyticsChart } from "@/components/analytics/WebsiteAnalyticsChart";

const WebsiteAnalyticsCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Website Traffic</CardTitle>
        <CardDescription>
          Visits to your websites in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-0 px-4">
        <WebsiteAnalyticsChart />
      </CardContent>
    </Card>
  );
};

export default WebsiteAnalyticsCard;
