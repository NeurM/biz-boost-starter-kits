
// Re-export all functionality from the individual service files for backward compatibility
// This ensures that existing imports from 'supabase.ts' continue to work

export * from './apiLogger';
export * from './authService';
export * from './dbService';
export * from './websiteService';
export * from './webhookService';
export * from './cicdService';

// Note: The functionality has been refactored into separate files:
// - apiLogger.ts: Utility for logging API calls
// - authService.ts: Authentication functions (signUp, signIn, signOut, getCurrentUser)
// - dbService.ts: Generic database operations (fetchData, insertData, updateData, deleteData)
// - websiteService.ts: Website configuration functions
// - webhookService.ts: Webhook management
// - cicdService.ts: CI/CD configuration and GitHub workflow generation
