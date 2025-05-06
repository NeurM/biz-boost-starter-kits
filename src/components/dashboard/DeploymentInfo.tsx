
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  GitBranch, 
  GitCommit, 
  Github, 
  GitCompare, 
  Rocket, 
  Settings, 
  DownloadCloud 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createCiCdConfig, getCiCdConfigs, updateCiCdConfig, getWorkflowYaml } from "@/utils/cicdService";
import { getWebsiteConfig, saveWebsiteConfig } from "@/utils/websiteService";

interface DeploymentInfoProps {
  websiteConfig?: {
    id: string;
    template_id: string;
    deployment_status?: string;
    deployment_url?: string;
    last_deployed_at?: string;
  };
}

const DeploymentInfo: React.FC<DeploymentInfoProps> = ({ websiteConfig }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('main');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [deployCommand, setDeployCommand] = useState('npm run deploy');
  const [cicdConfig, setCicdConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowYaml, setWorkflowYaml] = useState<string | null>(null);
  const [showYaml, setShowYaml] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const loadTemplateData = async () => {
      try {
        // Get first website config if none provided
        let config = websiteConfig;
        
        if (!config) {
          const { data, error } = await getWebsiteConfig('cleanslate');
          if (error) throw error;
          
          if (data) {
            config = data;
            setActiveTemplate(data.template_id);
          }
        } else {
          setActiveTemplate(config.template_id);
        }
        
        // Load CI/CD config if template is available
        if (config && config.template_id) {
          const { data, error } = await getCiCdConfigs(config.template_id);
          if (error) throw error;
          
          if (data && data.length > 0) {
            const latestConfig = data[0];
            setCicdConfig(latestConfig);
            setRepository(latestConfig.repository);
            setBranch(latestConfig.branch);
            setBuildCommand(latestConfig.build_command);
            setDeployCommand(latestConfig.deploy_command);
          }
        }
      } catch (error) {
        console.error('Error loading deployment data:', error);
        toast({
          title: "Error",
          description: "Failed to load deployment configuration.",
          variant: "destructive"
        });
      }
    };
    
    loadTemplateData();
  }, [user, websiteConfig, toast]);
  
  const handleSaveConfig = async () => {
    if (!activeTemplate) {
      toast({
        title: "Error",
        description: "No active template selected.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (cicdConfig) {
        // Update existing config
        const { error } = await updateCiCdConfig(cicdConfig.id, {
          repository,
          branch,
          build_command: buildCommand,
          deploy_command: deployCommand
        });
        
        if (error) throw error;
      } else {
        // Create new config
        const { error } = await createCiCdConfig(
          activeTemplate,
          repository,
          branch,
          buildCommand,
          deployCommand
        );
        
        if (error) throw error;
      }
      
      toast({
        title: "Configuration Saved",
        description: "Your deployment configuration has been updated."
      });
      
      // Update deployment status in website config
      if (websiteConfig) {
        await saveWebsiteConfig({
          template_id: websiteConfig.template_id,
          company_name: websiteConfig.id,
          domain_name: websiteConfig.id,
          logo: websiteConfig.id,
          deployment_status: 'configured',
          deployment_url: `https://${repository.split('/').pop()}.github.io`
        });
      }
      
    } catch (error) {
      console.error('Error saving deployment config:', error);
      toast({
        title: "Error",
        description: "Failed to save deployment configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateWorkflow = async () => {
    if (!activeTemplate) return;
    
    try {
      const yaml = await getWorkflowYaml(
        activeTemplate, 
        repository, 
        branch, 
        buildCommand, 
        deployCommand
      );
      
      setWorkflowYaml(yaml);
      setShowYaml(true);
    } catch (error) {
      console.error('Error generating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to generate workflow file.",
        variant: "destructive"
      });
    }
  };
  
  const copyToClipboard = () => {
    if (!workflowYaml) return;
    
    navigator.clipboard.writeText(workflowYaml);
    toast({
      title: "Copied",
      description: "Workflow YAML copied to clipboard"
    });
  };
  
  const getDeploymentStatus = () => {
    if (!websiteConfig || !websiteConfig.deployment_status) {
      return "Not configured";
    }
    
    return websiteConfig.deployment_status.charAt(0).toUpperCase() + 
      websiteConfig.deployment_status.slice(1);
  };
  
  const getLastDeployed = () => {
    if (!websiteConfig || !websiteConfig.last_deployed_at) {
      return "Never";
    }
    
    return new Date(websiteConfig.last_deployed_at).toLocaleString();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Deployment</CardTitle>
          <CardDescription>Configure CI/CD for your website</CardDescription>
        </div>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repository">GitHub Repository</Label>
            <div className="flex items-center space-x-2">
              <Github className="h-4 w-4" />
              <Input
                id="repository"
                placeholder="username/repository"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <Input
                id="branch"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
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
                onChange={(e) => setBuildCommand(e.target.value)}
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
                onChange={(e) => setDeployCommand(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-2 flex space-x-2">
            <Button 
              onClick={handleSaveConfig} 
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
            <Button
              variant="outline"
              onClick={generateWorkflow}
            >
              Generate Workflow
            </Button>
          </div>
          
          {showYaml && workflowYaml && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label>GitHub Workflow YAML</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  Copy
                </Button>
              </div>
              <Textarea
                className="font-mono text-xs h-64"
                value={workflowYaml}
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                Save this file as <code>.github/workflows/deploy.yml</code> in your repository.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentInfo;
