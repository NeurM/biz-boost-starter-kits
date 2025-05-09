
import React from 'react';
import { Rocket, DownloadCloud } from "lucide-react";

interface DeploymentStatusProps {
  deploymentStatus?: string;
  lastDeployedAt?: string;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  deploymentStatus,
  lastDeployedAt
}) => {
  const getDeploymentStatus = () => {
    if (!deploymentStatus) {
      return "Not configured";
    }
    
    return deploymentStatus.charAt(0).toUpperCase() + 
      deploymentStatus.slice(1);
  };
  
  const getLastDeployed = () => {
    if (!lastDeployedAt) {
      return "Never";
    }
    
    return new Date(lastDeployedAt).toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="space-y-1">
        <p className="text-sm font-medium">Status</p>
        <div className="flex items-center space-x-2">
          <Rocket className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {getDeploymentStatus()}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Last Deployed</p>
        <div className="flex items-center space-x-2">
          <DownloadCloud className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {getLastDeployed()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStatus;
