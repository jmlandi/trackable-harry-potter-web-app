
/**
 * SUPABASE CLIENT (BROWSER)
 * ==========================
 * Browser-side Supabase client for real-time database operations.
 * - Uses NEXT_PUBLIC_ environment variables (safe to expose)
 * - Uses JWT token for authentication
 * - Enforces Row-Level Security (RLS) policies
 *
 * Used for:
 * - Inserting contact form submissions
 * - Future: User authentication, real-time subscriptions
 */

import { createBrowserClient } from "@supabase/ssr";

// Load credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Create Supabase browser client
 * Each call creates a new client instance with JWT token
 *
 * @returns Supabase client configured for browser requests
 *
 * Usage in components:
 * const supabase = createClient();
 * await supabase.from('contacts').insert([{ email, message, ... }]);
 */
export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );