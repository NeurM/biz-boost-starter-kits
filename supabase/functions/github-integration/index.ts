
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle different operations based on path
    switch (path) {
      case 'generate-workflow':
        return await handleGenerateWorkflow(req);
      case 'webhook':
        return await handleWebhook(req);
      case 'create-repository':
        return await handleCreateRepository(req);
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Generate GitHub workflow YAML file
async function handleGenerateWorkflow(req) {
  const { 
    template_id, 
    repository, 
    branch = 'main', 
    build_command = 'npm run build', 
    deploy_command = 'npm run deploy' 
  } = await req.json();

  if (!template_id || !repository) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Get the website config for the deployment URL
  const { data: websiteConfig, error: configError } = await supabase
    .from('website_configs')
    .select('domain_name')
    .eq('template_id', template_id)
    .single();

  if (configError) {
    return new Response(JSON.stringify({ error: 'Website configuration not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const deployUrl = `https://${websiteConfig.domain_name}`;

  // Generate the workflow YAML content
  const workflowYaml = `name: Deploy ${template_id} Website

on:
  push:
    branches: [${branch}]
  pull_request:
    branches: [${branch}]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build website
        run: ${build_command}
      
      - name: Deploy to production
        run: ${deploy_command}
        env:
          DEPLOY_URL: ${deployUrl}
          
      - name: Notify deployment success
        if: success()
        run: |
          curl -X POST -H "Content-Type: application/json" \\
            -d '{"status":"success","repository":"${{ github.repository }}","branch":"${branch}"}' \\
            ${supabaseUrl}/functions/v1/github-integration/webhook
            
      - name: Notify deployment failure
        if: failure()
        run: |
          curl -X POST -H "Content-Type: application/json" \\
            -d '{"status":"failure","repository":"${{ github.repository }}","branch":"${branch}"}' \\
            ${supabaseUrl}/functions/v1/github-integration/webhook`;

  // Save the CI/CD configuration in the database
  const userId = await getUserIdFromRequest(req);
  if (userId) {
    await supabase.from('cicd_configs').upsert({
      user_id: userId,
      template_id,
      repository,
      branch,
      build_command,
      deploy_command,
      deployment_url: deployUrl,
      created_at: new Date().toISOString(),
    });
  }

  return new Response(JSON.stringify({ 
    yaml: workflowYaml, 
    filename: '.github/workflows/deploy.yml',
    message: 'GitHub workflow file generated successfully' 
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle webhook from GitHub Actions
async function handleWebhook(req) {
  const { status, repository, branch } = await req.json();
  
  // Log the webhook event
  console.log(`Received webhook: ${status} for ${repository} (${branch})`);
  
  // Update deployment status in the database
  const { data: config, error } = await supabase
    .from('cicd_configs')
    .select('id, template_id')
    .eq('repository', repository)
    .eq('branch', branch)
    .single();
  
  if (!error && config) {
    await supabase.from('website_configs').update({
      deployment_status: status,
      last_deployed_at: new Date().toISOString()
    }).eq('template_id', config.template_id);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Handle GitHub repository creation (setup webhook, etc)
async function handleCreateRepository(req) {
  const { repository, template_id } = await req.json();
  
  // In a real implementation, this would use GitHub API to create a repository
  // and set up webhooks. For now, we'll just simulate success.
  
  return new Response(JSON.stringify({ 
    success: true,
    message: `Repository ${repository} would be created for template ${template_id}`
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Utility function to extract user ID from request
async function getUserIdFromRequest(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) return null;
    return user.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}
