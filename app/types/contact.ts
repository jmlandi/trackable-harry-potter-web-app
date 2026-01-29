/**
 * CONTACT TYPE DEFINITION
 * =======================
 * TypeScript interface for contact form submissions.
 * Maps to the 'contacts' table in Supabase PostgreSQL database.
 */

/**
 * Contact form data structure
 *
 * @property id - Auto-generated UUID by Supabase (optional on insert)
 * @property first_name - Required user first name
 * @property last_name - Optional user last name
 * @property email - Required user email (used for contact)
 * @property message - Required message content
 * @property created_at - Auto-generated timestamp by Supabase (optional on insert)
 */
export interface Contact {
  // Auto-generated on insert
  id?: string;

  // Form fields
  first_name: string;
  last_name?: string;
  email: string;
  message: string;

  // Auto-generated on insert
  created_at?: string;
}
