
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
  DownloadCloud,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createCiCdConfig, getCiCdConfigs, updateCiCdConfig, getWorkflowYaml } from "@/utils/cicdService";
import { getWebsiteConfig, saveWebsiteConfig } from "@/utils/websiteService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DeploymentInfoProps {
  websiteConfig?: {
    id: string;
    template_id: string;
    company_name: string;
    domain_name: string;
    deployment_status?: string;
    deployment_url?: string;
    last_deployed_at?: string;
  } | null;
}

const DeploymentInfo: React.FC<DeploymentInfoProps> = ({ websiteConfig }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('main');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [deployCommand, setDeployCommand] = useState('npm run deploy');
  const [cicdConfig, setCicdConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowYaml, setWorkflowYaml] = useState<string | null>(null);
  const [showYaml, setShowYaml] = useState(false);
  
  useEffect(() => {
    if (!user || !websiteConfig) return;
    
    const loadCiCdConfig = async () => {
      try {
        setIsLoading(true);
        
        // Load CI/CD config if template is available
        if (websiteConfig && websiteConfig.template_id) {
          const { data, error } = await getCiCdConfigs(websiteConfig.template_id);
          if (error) throw error;
          
          if (data && data.length > 0) {
            const latestConfig = data[0];
            setCicdConfig(latestConfig);
            setRepository(latestConfig.repository);
            setBranch(latestConfig.branch);
            setBuildCommand(latestConfig.build_command);
            setDeployCommand(latestConfig.deploy_command);
          } else {
            // Reset fields if no config exists
            setRepository(websiteConfig.company_name.toLowerCase().replace(/\s+/g, '-'));
            setBranch('main');
            setBuildCommand('npm run build');
            setDeployCommand('npm run deploy');
          }
        }
      } catch (error) {
        console.error('Error loading deployment data:', error);
        toast({
          title: "Error",
          description: "Failed to load deployment configuration.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCiCdConfig();
  }, [user, websiteConfig, toast]);
  
  const handleSaveConfig = async () => {
    if (!websiteConfig) {
      toast({
        title: "Error",
        description: "No website selected.",
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
          websiteConfig.template_id,
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
        const deploymentUrl = `https://${repository.split('/').pop()}.github.io`;
        await saveWebsiteConfig({
          template_id: websiteConfig.template_id,
          company_name: websiteConfig.company_name,
          domain_name: websiteConfig.domain_name,
          logo: websiteConfig.id,
          deployment_status: 'configured',
          deployment_url: deploymentUrl
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
    if (!websiteConfig) return;
    
    try {
      const yaml = await getWorkflowYaml(
        websiteConfig.template_id, 
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
  
  if (!websiteConfig) {
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
          <Alert>
            <AlertTitle>No Website Selected</AlertTitle>
            <AlertDescription>
              Please select a website from your saved websites above to configure deployment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Deployment</CardTitle>
          <CardDescription>Configure CI/CD for {websiteConfig.company_name}</CardDescription>
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

        <Alert className="mb-4">
          <AlertDescription>
            These settings will generate a GitHub Actions workflow for deploying your website.
            You will need to commit this file to your GitHub repository.
          </AlertDescription>
        </Alert>

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
          
          <div className="pt-2 flex flex-wrap gap-2">
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
            {websiteConfig.deployment_url && (
              <Button
                variant="secondary"
                onClick={() => window.open(websiteConfig.deployment_url, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Deployed Site
              </Button>
            )}
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
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Save this file as <code className="bg-muted px-1 py-0.5 rounded">.github/workflows/deploy.yml</code> in your repository.
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Create a new GitHub repository at the URL specified above</li>
                  <li>Download the full React code using the "Download Code" panel</li>
                  <li>Push the code to your GitHub repository</li>
                  <li>Add this workflow file to deploy your site automatically</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentInfo;
