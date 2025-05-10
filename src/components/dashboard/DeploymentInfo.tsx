import React, { useState, useEffect } from 'react';
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  getWorkflowYaml, 
  createCiCdConfig, 
  getCiCdConfigs, 
  updateCiCdConfig,
  CICDConfig
} from "@/utils/cicdService";
import { saveWebsiteConfig } from "@/utils/websiteService";
import { Alert, AlertDescription } from "@/components/ui/alert";

import DeploymentInfoCard, { NoWebsiteSelected } from './deployment/DeploymentInfoCard';
import DeploymentStatus from './deployment/DeploymentStatus';
import ConfigurationForm from './deployment/ConfigurationForm';
import WorkflowDisplay from './deployment/WorkflowDisplay';

interface WebsiteConfig {
  id: string;
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
  deployment_status?: string;
  deployment_url?: string;
  last_deployed_at?: string;
}

interface DeploymentInfoProps {
  websiteConfig?: WebsiteConfig | null;
}

const DeploymentInfo: React.FC<DeploymentInfoProps> = ({ websiteConfig }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('main');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [deployCommand, setDeployCommand] = useState('npm run deploy');
  const [cicdConfig, setCicdConfig] = useState<CICDConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowYaml, setWorkflowYaml] = useState<string | null>(null);
  const [showYaml, setShowYaml] = useState(false);
  
  useEffect(() => {
    if (!user || !websiteConfig) return;
    
    const loadCiCdConfig = async () => {
      try {
        setIsLoading(true);
        
        if (websiteConfig && websiteConfig.template_id) {
          const configResponse = await getCiCdConfigs(websiteConfig.template_id);
          
          // If there's an existing config, use it
          if (configResponse.data && configResponse.data.length > 0) {
            const config = configResponse.data[0];
            setRepository(config.repository || '');
            setBranch(config.branch || 'main');
            setBuildCommand(config.build_command || 'npm run build');
            setDeployCommand(config.deploy_command || 'npm run deploy');
            setCicdConfig(config);
          } else {
            // Initialize with default values based on the website name
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
      let configResponse;
      
      if (cicdConfig && cicdConfig.id) {
        // Update existing config
        configResponse = await updateCiCdConfig(cicdConfig.id, {
          repository,
          branch,
          build_command: buildCommand,
          deploy_command: deployCommand
        });
      } else {
        // Create new config
        configResponse = await createCiCdConfig(
          websiteConfig.template_id,
          repository,
          branch,
          buildCommand,
          deployCommand
        );
      }
      
      if (configResponse.error) {
        throw configResponse.error;
      }
      
      setCicdConfig(configResponse.data);
      
      toast({
        title: "Configuration Saved",
        description: "Your deployment configuration has been updated."
      });
      
      // Update deployment status in website config
      const deploymentUrl = `https://${repository.split('/').pop()}.github.io`;
      
      await saveWebsiteConfig({
        ...websiteConfig,
        deployment_status: 'configured',
        deployment_url: deploymentUrl
      });
      
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
  
  const handleViewDeployedSite = () => {
    if (websiteConfig?.deployment_url) {
      window.open(websiteConfig.deployment_url, '_blank');
    }
  };

  if (!websiteConfig) {
    return (
      <DeploymentInfoCard title="Deployment" description="Configure CI/CD for your website">
        <NoWebsiteSelected />
      </DeploymentInfoCard>
    );
  }

  return (
    <DeploymentInfoCard 
      title="Deployment" 
      description={`Configure CI/CD for ${websiteConfig.company_name}`}
    >
      <DeploymentStatus 
        deploymentStatus={websiteConfig.deployment_status} 
        lastDeployedAt={websiteConfig.last_deployed_at}
      />

      <Alert className="mb-4">
        <AlertDescription>
          These settings will generate a GitHub Actions workflow for deploying your website.
          You will need to commit this file to your GitHub repository.
        </AlertDescription>
      </Alert>

      <ConfigurationForm
        repository={repository}
        branch={branch}
        buildCommand={buildCommand}
        deployCommand={deployCommand}
        isLoading={isLoading}
        onRepositoryChange={setRepository}
        onBranchChange={setBranch}
        onBuildCommandChange={setBuildCommand}
        onDeployCommandChange={setDeployCommand}
        onSaveConfig={handleSaveConfig}
        onGenerateWorkflow={generateWorkflow}
        onViewDeployedSite={handleViewDeployedSite}
        deploymentUrl={websiteConfig.deployment_url}
      />
      
      <WorkflowDisplay 
        workflowYaml={workflowYaml} 
        showYaml={showYaml} 
      />
    </DeploymentInfoCard>
  );
};

export default DeploymentInfo;
