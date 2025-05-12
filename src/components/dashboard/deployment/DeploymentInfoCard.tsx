
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-muted-foreground/20 shadow-md transition-all hover:shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Rocket className="h-5 w-5 text-purple-500" />
            </div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
          </div>
          <CardDescription className="mt-2 text-muted-foreground/90">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const NoWebsiteSelected: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Alert variant="destructive" className="glass-card bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-200 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-base font-medium">No Website Selected</AlertTitle>
        <AlertDescription className="text-sm mt-2">
          Please select a website from your saved websites above to configure deployment.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default DeploymentInfoCard;
