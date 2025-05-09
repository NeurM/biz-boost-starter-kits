
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export const NoWebsiteSelected: React.FC = () => {
  return (
    <Alert>
      <AlertTitle>No Website Selected</AlertTitle>
      <AlertDescription>
        Please select a website from your saved websites above to configure deployment.
      </AlertDescription>
    </Alert>
  );
};

export default DeploymentInfoCard;
