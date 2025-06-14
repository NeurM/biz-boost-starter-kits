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
  
  const [customDomain, setCustomDomain] = useState('');
  const [cicdConfig, setCicdConfig] = useState<CICDConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowYaml, setWorkflowYaml] = useState<string | null>(null);
  const [showYaml, setShowYaml] = useState(false);
  
  useEffect(() => {
    if (!user || !websiteConfig) return;
    // For each website, custom domain is the key state.
    const loadCiCdConfig = async () => {
      try {
        setIsLoading(true);
        if (websiteConfig && websiteConfig.template_id) {
          const configResponse = await getCiCdConfigs(websiteConfig.template_id);
          if (configResponse.data && configResponse.data.length > 0) {
            const config = configResponse.data[0];
            setCustomDomain(config.custom_domain || websiteConfig.domain_name || '');
            setCicdConfig(config);
          } else {
            setCustomDomain(websiteConfig.domain_name || '');
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
    // eslint-disable-next-line
  }, [user, websiteConfig, toast]);
  
  const handleSaveConfig = async () => {
    if (!websiteConfig || !customDomain) {
      toast({
        title: "Error",
        description: "Please enter a custom domain.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      let configResponse;
      if (cicdConfig && cicdConfig.id) {
        configResponse = await updateCiCdConfig(cicdConfig.id, {
          custom_domain: customDomain
        });
      } else {
        configResponse = await createCiCdConfig(
          websiteConfig.template_id,
          '', // repository is unused for Hostinger model
          '', // branch unused
          '', // build unused
          '', // deploy unused
          customDomain
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
      // Just save custom domain as deployment_url (actual deployment service will validate this)
      await saveWebsiteConfig({
        ...websiteConfig,
        deployment_status: 'configured',
        deployment_url: `https://${customDomain}`
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
    if (!websiteConfig || !customDomain) return;
    try {
      setIsLoading(true);
      // Generate Hostinger FTP GitHub Action workflow
      const yaml = await getWorkflowYaml(
        websiteConfig.template_id, 
        '', '', '', '', customDomain // Pass domain to workflow builder
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewDeployedSite = () => {
    if (customDomain) {
      window.open(`https://${customDomain}`, '_blank');
    }
  };

  if (!websiteConfig) {
    return (
      <DeploymentInfoCard title="Deployment" description="Configure deployment for your website">
        <NoWebsiteSelected />
      </DeploymentInfoCard>
    );
  }

  return (
    <DeploymentInfoCard 
      title="Deployment" 
      description={`Configure deployment for ${websiteConfig.company_name}`}
    >
      <DeploymentStatus 
        deploymentStatus={websiteConfig.deployment_status} 
        lastDeployedAt={websiteConfig.last_deployed_at}
      />
      <Alert className="mb-4">
        <AlertDescription>
          Enter the custom domain for this client. On deploy, we'll publish the website directly to Hostinger using the agency's FTP account. 
          You may need to configure DNS so the domain points to Hostinger. Contact your agency admin if you are unsure.
        </AlertDescription>
      </Alert>

      <ConfigurationForm
        customDomain={customDomain}
        isLoading={isLoading}
        onCustomDomainChange={setCustomDomain}
        onSaveConfig={handleSaveConfig}
        onGenerateWorkflow={generateWorkflow}
        onViewDeployedSite={handleViewDeployedSite}
        deploymentUrl={customDomain ? `https://${customDomain}` : undefined}
      />
      <WorkflowDisplay 
        workflowYaml={workflowYaml} 
        showYaml={showYaml} 
      />
    </DeploymentInfoCard>
  );
};

export default DeploymentInfo;
