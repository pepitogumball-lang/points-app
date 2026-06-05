/**
 * Supabase client configuration
 * Design: Void Terminal — Cyberpunk Glassmorphism
 *
 * Environment variables required:
 *   VITE_SUPABASE_URL  — your Supabase project URL
 *   VITE_SUPABASE_KEY  — your Supabase anon/public key
 *
 * These must be set in a .env file or in your hosting provider's
 * environment variable settings (Netlify / Render).
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Points] Supabase env vars not set. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export type PointsRow = {
  id: number;
  points: number;
};
