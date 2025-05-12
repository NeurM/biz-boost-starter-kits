
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeploymentInfoCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const DeploymentInfoCard: React.FC<DeploymentInfoCardProps> = ({
  title,
  description,
  children
}) => {
  return (
    <Card className="border-muted-foreground/20 shadow-md transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-center space-x-2">
          <Rocket className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export const NoWebsiteSelected: React.FC = () => {
  return (
    <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-200">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>No Website Selected</AlertTitle>
      <AlertDescription>
        Please select a website from your saved websites above to configure deployment.
      </AlertDescription>
    </Alert>
  );
};

export default DeploymentInfoCard;
