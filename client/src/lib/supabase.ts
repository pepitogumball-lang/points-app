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

let supabaseUrl = '';
let supabaseKey = '';

// Intentar cargar desde config.json (inyectado por el servidor)
async function loadConfig() {
  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const config = await response.json();
      supabaseUrl = config.supabaseUrl;
      supabaseKey = config.supabaseKey;
      console.log('[Points] Config loaded from /config.json');
    }
  } catch (error) {
    console.error('[Points] Failed to load config.json:', error);
  }

  // Fallback a import.meta.env
  if (!supabaseUrl) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  }
  if (!supabaseKey) {
    supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
  }

  // Fallback a window global
  if (!supabaseUrl) {
    supabaseUrl = (window as any).__SUPABASE_URL__ || '';
  }
  if (!supabaseKey) {
    supabaseKey = (window as any).__SUPABASE_KEY__ || '';
  }

  // Validar
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
    console.error('[Points] FATAL: Supabase env vars not set or are placeholders');
    console.error('URL:', supabaseUrl);
    console.error('KEY:', supabaseKey);
    throw new Error('Supabase configuration missing or invalid');
  }

  console.log('[Points] Supabase configured successfully');
}

// Crear cliente (será inicializado después de cargar config)
let supabaseClient: ReturnType<typeof createClient> | null = null;

export async function initSupabase() {
  await loadConfig();
  
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabaseClient;
}

export function getSupabase() {
  if (!supabaseClient) {
    throw new Error('Supabase not initialized. Call initSupabase() first.');
  }
  return supabaseClient;
}

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }
    return (supabaseClient as any)[prop];
  },
});

export type PointsRow = {
  id: number;
  points: number;
};
