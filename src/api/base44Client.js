// Import base44 SDK for database operations
import * as base44SDK from '@base44/sdk';

// Get the base44 instance (it might be default or a named export)
const base44 = base44SDK.default || base44SDK;

// Export the base44 instance for use throughout the app
export { base44 };
