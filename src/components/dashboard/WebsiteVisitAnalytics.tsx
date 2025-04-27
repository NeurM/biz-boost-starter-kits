
import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WebsiteVisitAnalyticsProps {
  websiteId: string;
  websiteName: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const WebsiteVisitAnalytics: React.FC<WebsiteVisitAnalyticsProps> = ({ websiteId, websiteName }) => {
  const [timeframe, setTimeframe] = useState('7days');
  
  // For demo purposes, generate sample data
  const pageViewData = useMemo(() => {
    const days = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 90;
    return Array(days).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toLocaleDateString(),
        views: Math.floor(Math.random() * 100) + 10,
      };
    });
  }, [timeframe]);
  
  // Sample click data by page
  const clickData = useMemo(() => [
    { name: 'Home Page', clicks: Math.floor(Math.random() * 200) + 50 },
    { name: 'About Page', clicks: Math.floor(Math.random() * 200) + 20 },
    { name: 'Services', clicks: Math.floor(Math.random() * 200) + 30 },
    { name: 'Contact', clicks: Math.floor(Math.random() * 200) + 10 },
    { name: 'Blog', clicks: Math.floor(Math.random() * 200) + 25 },
  ], []);
  
  // Sample element click data
  const elementClickData = useMemo(() => [
    { name: 'Navigation Links', value: Math.floor(Math.random() * 200) + 50 },
    { name: 'CTA Buttons', value: Math.floor(Math.random() * 200) + 40 },
    { name: 'Images', value: Math.floor(Math.random() * 200) + 30 },
    { name: 'Footer Links', value: Math.floor(Math.random() * 200) + 20 },
    { name: 'Other Elements', value: Math.floor(Math.random() * 200) + 10 },
  ], []);

  // Sample scroll depth data
  const scrollDepthData = useMemo(() => [
    { name: '0-25%', value: Math.floor(Math.random() * 100) + 200 },
    { name: '25-50%', value: Math.floor(Math.random() * 100) + 150 },
    { name: '50-75%', value: Math.floor(Math.random() * 100) + 100 },
    { name: '75-100%', value: Math.floor(Math.random() * 100) + 50 },
  ], []);
  
  // Sample traffic sources
  const trafficSourcesData = useMemo(() => [
    { name: 'Direct', value: Math.floor(Math.random() * 100) + 100 },
    { name: 'Search', value: Math.floor(Math.random() * 100) + 150 },
    { name: 'Referral', value: Math.floor(Math.random() * 100) + 80 },
    { name: 'Social', value: Math.floor(Math.random() * 100) + 60 },
  ], []);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{websiteName} Analytics</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pageViewData.reduce((acc, curr) => acc + curr.views, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clickData.reduce((acc, curr) => acc + curr.clicks, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{`${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="pageviews">
        <TabsList className="mb-4">
          <TabsTrigger value="pageviews">Page Views</TabsTrigger>
          <TabsTrigger value="clicks">Clicks by Page</TabsTrigger>
          <TabsTrigger value="elements">Element Interactions</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pageviews">
          <Card>
            <CardHeader>
              <CardTitle>Page Views Over Time</CardTitle>
              <CardDescription>View count trend over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={pageViewData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clicks">
          <Card>
            <CardHeader>
              <CardTitle>Clicks by Page</CardTitle>
              <CardDescription>Number of clicks on each page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clickData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clicks" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="elements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Element Click Distribution</CardTitle>
                <CardDescription>Types of elements visitors interact with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={elementClickData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {elementClickData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scroll Depth</CardTitle>
                <CardDescription>How far visitors scroll down your pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scrollDepthData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteVisitAnalytics;
