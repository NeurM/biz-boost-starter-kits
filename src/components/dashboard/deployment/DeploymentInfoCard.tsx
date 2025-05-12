
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
  // Animation variants for staggered child animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.15)"
      }}
      className="relative"
    >
      <Card className="border-muted-foreground/20 shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-950/80 border-[0.5px]">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 backdrop-blur-sm">
          <motion.div 
            className="flex items-center space-x-2"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/30 backdrop-blur-sm shadow-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Rocket className="h-5 w-5 text-purple-500" />
            </motion.div>
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              {title}
            </CardTitle>
          </motion.div>
          <CardDescription className="mt-2 text-muted-foreground/90">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {description}
            </motion.span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        </CardContent>
      </Card>
      <motion.div 
        className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-200/20 to-blue-200/20 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 0.95 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
    </motion.div>
  );
};

export const NoWebsiteSelected: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: 0.3, 
        duration: 0.4,
        type: "spring",
        stiffness: 100
      }}
      className="overflow-hidden"
    >
      <Alert 
        variant="destructive" 
        className="glass-card bg-amber-50/80 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700/60 dark:text-amber-200 backdrop-blur-sm shadow-lg border-[0.5px]"
      >
        <motion.div 
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle className="h-4 w-4" />
        </motion.div>
        <AlertTitle className="text-base font-medium">No Website Selected</AlertTitle>
        <AlertDescription className="text-sm mt-2">
          Please select a website from your saved websites above to configure deployment.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default DeploymentInfoCard;
