
import React from 'react';
import { Rocket, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeploymentStatusProps {
  deploymentStatus?: string;
  lastDeployedAt?: string;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  deploymentStatus,
  lastDeployedAt
}) => {
  const getStatusIcon = () => {
    if (!deploymentStatus) return <Clock className="h-4 w-4" />;
    
    switch(deploymentStatus.toLowerCase()) {
      case 'deployed':
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'configured':
        return <Rocket className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusColor = () => {
    if (!deploymentStatus) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    
    switch(deploymentStatus.toLowerCase()) {
      case 'deployed':
      case 'success':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case 'failed':
      case 'error':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case 'configured':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };
  
  const getStatusText = () => {
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
    
    const date = new Date(lastDeployedAt);
    // Format date: May 12, 2025 at 14:30
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0 mb-6 bg-muted/50 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-1">Status</span>
          <Badge variant="outline" className={getStatusColor()}>
            <span className="flex items-center">
              {getStatusIcon()}
              <span className="ml-1.5">{getStatusText()}</span>
            </span>
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-1">Last Deployed</span>
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{getLastDeployed()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStatus;
