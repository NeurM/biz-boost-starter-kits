
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, GitBranch, GitCommit, GitCompare, ExternalLink } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="repository">GitHub Repository</Label>
        <div className="flex items-center space-x-2">
          <Github className="h-4 w-4" />
          <Input
            id="repository"
            placeholder="username/repository"
            value={repository}
            onChange={(e) => onRepositoryChange(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Format: username/repository-name
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <div className="flex items-center space-x-2">
          <GitBranch className="h-4 w-4" />
          <Input
            id="branch"
            placeholder="main"
            value={branch}
            onChange={(e) => onBranchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="build">Build Command</Label>
        <div className="flex items-center space-x-2">
          <GitCommit className="h-4 w-4" />
          <Input
            id="build"
            placeholder="npm run build"
            value={buildCommand}
            onChange={(e) => onBuildCommandChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deploy">Deploy Command</Label>
        <div className="flex items-center space-x-2">
          <GitCompare className="h-4 w-4" />
          <Input
            id="deploy"
            placeholder="npm run deploy"
            value={deployCommand}
            onChange={(e) => onDeployCommandChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="pt-2 flex flex-wrap gap-2">
        <Button 
          onClick={onSaveConfig} 
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
        <Button
          variant="outline"
          onClick={onGenerateWorkflow}
        >
          Generate Workflow
        </Button>
        {deploymentUrl && (
          <Button
            variant="secondary"
            onClick={onViewDeployedSite}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Deployed Site
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConfigurationForm;
