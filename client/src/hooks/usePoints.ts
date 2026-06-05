/**
 * usePoints — Custom hook for Points data management
 * Design: Void Terminal — Cyberpunk Glassmorphism
 *
 * Features:
 * - Fetches initial points from Supabase `stats` table (row id=1)
 * - Subscribes to Realtime changes for live updates
 * - Implements Optimistic UI: updates locally before server confirms
 * - Handles loading/error states gracefully
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

const TABLE = 'stats';
const ROW_ID = 1;

export type PointsState = {
  points: number | null;
  loading: boolean;
  error: string | null;
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
};

export function usePoints(): PointsState {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track optimistic value to avoid race conditions with realtime
  const optimisticRef = useRef<number | null>(null);

  // ── Initial fetch ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchPoints = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from(TABLE)
          .select('points')
          .eq('id', ROW_ID)
          .single();

        if (cancelled) return;

        if (fetchError) {
          // If row doesn't exist, create it with 0
          if (fetchError.code === 'PGRST116') {
            const { data: inserted, error: insertError } = await supabase
              .from(TABLE)
              .insert({ id: ROW_ID, points: 0 })
              .select('points')
              .single();

            if (!cancelled) {
              if (insertError) {
                setError('No se pudo inicializar la base de datos.');
              } else {
                setPoints(inserted?.points ?? 0);
              }
            }
          } else {
            setError('Error al conectar con la base de datos.');
          }
        } else {
          setPoints(data?.points ?? 0);
        }
      } catch {
        if (!cancelled) setError('Error de conexión.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPoints();
    return () => { cancelled = true; };
  }, []);

  // ── Realtime subscription ─────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('stats-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: TABLE, filter: `id=eq.${ROW_ID}` },
        (payload) => {
          const newPoints = (payload.new as { points: number }).points;
          // Only accept server value if it matches or exceeds our optimistic value
          // to avoid flickering back to stale data
          setPoints(newPoints);
          optimisticRef.current = null;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Optimistic update helper ──────────────────────────────
  const updatePoints = useCallback(async (delta: number) => {
    setPoints((prev) => {
      const next = (prev ?? 0) + delta;
      optimisticRef.current = next;
      return next;
    });

    try {
      // Use RPC for atomic increment/decrement
      const { error: rpcError } = await supabase.rpc('increment_points', {
        row_id: ROW_ID,
        delta_value: delta,
      });

      if (rpcError) {
        // Fallback: manual read-modify-write
        const { data: current } = await supabase
          .from(TABLE)
          .select('points')
          .eq('id', ROW_ID)
          .single();

        const currentPoints = current?.points ?? 0;
        const { error: updateError } = await supabase
          .from(TABLE)
          .update({ points: currentPoints + delta })
          .eq('id', ROW_ID);

        if (updateError) {
          // Rollback optimistic update
          setPoints((prev) => (prev ?? 0) - delta);
          setError('Error al actualizar. Intenta de nuevo.');
          setTimeout(() => setError(null), 3000);
        }
      }
    } catch {
      // Rollback on network error
      setPoints((prev) => (prev ?? 0) - delta);
      setError('Error de red. Intenta de nuevo.');
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  const increment = useCallback(() => updatePoints(1), [updatePoints]);
  const decrement = useCallback(() => updatePoints(-1), [updatePoints]);

  return { points, loading, error, increment, decrement };
}
