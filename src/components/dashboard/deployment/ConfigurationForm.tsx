
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, GitBranch, GitCommit, GitCompare, ExternalLink, Info } from "lucide-react";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ConfigurationFormProps {
  repository: string;
  branch: string;
  buildCommand: string;
  deployCommand: string;
  isLoading: boolean;
  onRepositoryChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onBuildCommandChange: (value: string) => void;
  onDeployCommandChange: (value: string) => void;
  onSaveConfig: () => void;
  onGenerateWorkflow: () => void;
  onViewDeployedSite?: () => void;
  deploymentUrl?: string;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  repository,
  branch,
  buildCommand,
  deployCommand,
  isLoading,
  onRepositoryChange,
  onBranchChange,
  onBuildCommandChange,
  onDeployCommandChange,
  onSaveConfig,
  onGenerateWorkflow,
  onViewDeployedSite,
  deploymentUrl
}) => {
  // Parent container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Child item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-2" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <Label htmlFor="repository" className="text-sm font-medium">GitHub Repository</Label>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                <Info className="h-3.5 w-3.5" />
                <span className="sr-only">Info</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="text-sm">
                <h4 className="font-medium">Repository Format</h4>
                <p className="text-muted-foreground mt-1">
                  Enter your GitHub username followed by a slash and your repository name (e.g., "username/my-website").
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Github className="h-4 w-4" />
          </div>
          <Input
            id="repository"
            placeholder="username/repository"
            value={repository}
            onChange={(e) => onRepositoryChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Format: username/repository-name
        </p>
      </motion.div>
      
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="branch" className="text-sm font-medium">Branch</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <GitBranch className="h-4 w-4" />
          </div>
          <Input
            id="branch"
            placeholder="main"
            value={branch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>
      
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="build" className="text-sm font-medium">Build Command</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <GitCommit className="h-4 w-4" />
          </div>
          <Input
            id="build"
            placeholder="npm run build"
            value={buildCommand}
            onChange={(e) => onBuildCommandChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>
      
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="deploy" className="text-sm font-medium">Deploy Command</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <GitCompare className="h-4 w-4" />
          </div>
          <Input
            id="deploy"
            placeholder="npm run deploy"
            value={deployCommand}
            onChange={(e) => onDeployCommandChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="pt-4 flex flex-wrap gap-3" 
        variants={itemVariants}
      >
        <Button 
          onClick={onSaveConfig} 
          disabled={isLoading}
          className="relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        </Button>
        
        <Button
          variant="outline"
          onClick={onGenerateWorkflow}
          className="relative overflow-hidden group"
        >
          <span className="relative z-10">Generate Workflow</span>
          <span className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        </Button>
        
        {deploymentUrl && (
          <Button
            variant="secondary"
            onClick={onViewDeployedSite}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>View Deployed Site</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ConfigurationForm;
