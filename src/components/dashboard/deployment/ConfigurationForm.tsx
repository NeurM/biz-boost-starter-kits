
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ConfigurationFormProps {
  customDomain: string;
  isLoading: boolean;
  onCustomDomainChange: (value: string) => void;
  onSaveConfig: () => void;
  onGenerateWorkflow: () => void;
  onViewDeployedSite?: () => void;
  deploymentUrl?: string;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  customDomain,
  isLoading,
  onCustomDomainChange,
  onSaveConfig,
  onGenerateWorkflow,
  onViewDeployedSite,
  deploymentUrl
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  const buttonHoverVariants = {
    hover: { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="space-y-7 bg-gradient-to-r from-background/70 to-muted/40 rounded-xl p-6 border border-border/40 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-2.5" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <Label htmlFor="customDomain" className="text-sm font-medium flex items-center">
            Custom Domain
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1.5 rounded-full">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="sr-only">Domain Info</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="text-sm space-y-2">
                  <h4 className="font-medium">Domain Setup</h4>
                  <p className="text-muted-foreground">
                    Enter the full domain (e.g., <strong>clientwebsite.com</strong>) you want the website to be live on. You must configure your domain's DNS to point to the Hostinger hosting. If the domain is not yet active, see instructions or contact your agency admin.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </Label>
        </div>
        <Input
          id="customDomain"
          placeholder="clientwebsite.com"
          value={customDomain}
          onChange={(e) => onCustomDomainChange(e.target.value)}
          className="pr-4 transition-shadow duration-200 focus:shadow-md"
        />
        <p className="text-xs text-muted-foreground mt-1">
          The website will be live at this domain.
        </p>
      </motion.div>

      <motion.div 
        className="pt-5 flex flex-wrap gap-3" 
        variants={itemVariants}
      >
        <motion.div
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button 
            onClick={onSaveConfig} 
            disabled={isLoading || !customDomain}
            className="relative overflow-hidden shadow-sm"
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
          </Button>
        </motion.div>
        
        <motion.div
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="outline"
            onClick={onGenerateWorkflow}
            className="relative overflow-hidden shadow-sm"
            disabled={!customDomain}
          >
            <span className="relative z-10">Generate Workflow</span>
          </Button>
        </motion.div>
        
        {deploymentUrl && (
          <motion.div
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <Button
              variant="secondary"
              onClick={onViewDeployedSite}
              className="shadow-sm"
            >
              <span className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View Deployed Site</span>
              </span>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ConfigurationForm;
