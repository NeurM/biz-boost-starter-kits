
import React from 'react';
import { Rocket, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800";
      case 'failed':
      case 'error':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800";
      case 'configured':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700";
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col space-y-5 sm:flex-row sm:justify-between sm:space-y-0 mb-8 bg-gradient-to-b from-muted/60 to-muted/30 backdrop-blur-sm p-4 rounded-lg border border-muted-foreground/10"
    >
      <div className="flex items-center space-x-3">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-2">Status</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge variant="outline" className={`${getStatusColor()} px-3 py-1.5 text-sm shadow-sm hover:shadow transition-all duration-300`}>
                <motion.span 
                  className="flex items-center" 
                  animate={{ scale: deploymentStatus === 'success' ? [1, 1.05, 1] : 1 }}
                  transition={{ repeat: deploymentStatus === 'success' ? 1 : 0, duration: 0.5 }}
                >
                  {getStatusIcon()}
                  <span className="ml-2 font-medium">{getStatusText()}</span>
                </motion.span>
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="text-sm">
                <p className="font-semibold mb-1">Deployment Status</p>
                <p className="text-muted-foreground">
                  {!deploymentStatus 
                    ? "Your website has not been configured for deployment yet."
                    : deploymentStatus === 'configured'
                      ? "Your website is configured for deployment but has not been deployed yet."
                      : deploymentStatus === 'deployed' || deploymentStatus === 'success'
                        ? "Your website has been successfully deployed."
                        : "There was an error deploying your website."}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-2">Last Deployed</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/40 rounded-md border border-muted-foreground/10 hover:bg-muted/60 transition-colors duration-300">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{getLastDeployed()}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="text-sm">
                <p className="font-semibold mb-1">Last Deployment</p>
                <p className="text-muted-foreground">
                  {lastDeployedAt
                    ? `Your website was last deployed on ${getLastDeployed()}.`
                    : "Your website has never been deployed."}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </motion.div>
  );
};

export default DeploymentStatus;
