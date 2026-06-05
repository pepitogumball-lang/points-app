/**
 * Admin page — Hidden control panel at /Holaquetalsoypepi5
 * Design: Void Terminal — Cyberpunk Glassmorphism
 *
 * Features:
 * - +1 / -1 buttons with Optimistic UI
 * - Realtime counter display
 * - Keyboard shortcuts (+ / -)
 * - Access indicator
 */

import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { usePoints } from '@/hooks/usePoints';
import { motion } from 'framer-motion';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Lock,
  Minus,
  Plus,
  Shield,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function Admin() {
  const { points, loading, error, increment, decrement } = usePoints();
  const [lastAction, setLastAction] = useState<'+1' | '-1' | null>(null);
  const [actionCount, setActionCount] = useState(0);

  const handleIncrement = useCallback(async () => {
    setLastAction('+1');
    setActionCount((c) => c + 1);
    await increment();
    setTimeout(() => setLastAction(null), 600);
  }, [increment]);

  const handleDecrement = useCallback(async () => {
    setLastAction('-1');
    setActionCount((c) => c + 1);
    await decrement();
    setTimeout(() => setLastAction(null), 600);
  }, [decrement]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === '+' || e.key === '=') handleIncrement();
      if (e.key === '-') handleDecrement();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleIncrement, handleDecrement]);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#020617' }}
    >
      <ParticleBackground />

      {/* Radial gradient orbs — violet dominant for admin */}
      <div
        className="fixed pointer-events-none"
        style={{
          inset: 0,
          zIndex: 1,
          background: `
            radial-gradient(ellipse 60% 50% at 25% 35%, rgba(124,58,237,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 75% 65%, rgba(6,182,212,0.07) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-12">

        {/* Admin badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-2 mb-8"
        >
          <Shield
            size={14}
            style={{ color: 'rgba(124,58,237,0.9)', filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.8))' }}
          />
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(124,58,237,0.7)',
              letterSpacing: '0.3em',
            }}
          >
            PANEL DE CONTROL
          </span>
          <Lock
            size={12}
            style={{ color: 'rgba(124,58,237,0.5)' }}
          />
        </motion.div>

        {/* Main glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="glass-card scanlines relative flex flex-col items-center px-8 py-10 sm:px-14 sm:py-12"
          style={{
            minWidth: 'min(90vw, 480px)',
            border: '1px solid rgba(124,58,237,0.25)',
            boxShadow: `
              0 0 0 1px rgba(124,58,237,0.08),
              0 8px 32px rgba(0,0,0,0.4),
              0 0 60px rgba(124,58,237,0.08),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(124,58,237,0.06) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Counter label */}
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4 relative z-10"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(6,182,212,0.7)',
              textShadow: '0 0 10px rgba(6,182,212,0.4)',
            }}
          >
            PUNTOS ACTUALES
          </p>

          {/* Counter display */}
          <div className="relative z-10 mb-2">
            {loading ? (
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-mono-display neon-text-violet"
                style={{ fontSize: 'clamp(4rem, 14vw, 10rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
              >
                ···
              </motion.div>
            ) : (
              <AnimatedCounter
                value={points ?? 0}
                className="font-mono-display neon-text-violet animate-pulse-glow"
                style={{ fontSize: 'clamp(4rem, 14vw, 10rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
              />
            )}
          </div>

          {/* Last action flash */}
          <div className="h-8 flex items-center justify-center relative z-10 mb-4">
            {lastAction && (
              <motion.span
                key={actionCount}
                initial={{ opacity: 0, y: -8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="font-mono-display text-2xl font-bold"
                style={{
                  color: lastAction === '+1' ? 'rgba(6,182,212,0.9)' : 'rgba(248,113,113,0.9)',
                  textShadow: lastAction === '+1'
                    ? '0 0 20px rgba(6,182,212,0.8)'
                    : '0 0 20px rgba(248,113,113,0.8)',
                }}
              >
                {lastAction}
              </motion.span>
            )}
          </div>

          {/* Divider */}
          <div
            className="w-full mb-8 relative z-10"
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.3), transparent)',
            }}
          />

          {/* Control buttons */}
          <div className="flex items-center gap-6 relative z-10">
            {/* Decrement button */}
            <motion.button
              onClick={handleDecrement}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon-violet relative flex flex-col items-center justify-center rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                width: '5rem',
                height: '5rem',
                fontSize: '1.75rem',
              }}
              aria-label="Restar 1 punto"
            >
              <Minus size={28} strokeWidth={2.5} />
              <span
                className="absolute -bottom-6 text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'rgba(124,58,237,0.5)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                }}
              >
                [ - ]
              </span>
            </motion.button>

            {/* Center indicator */}
            <div className="flex flex-col items-center gap-1">
              <ChevronUp size={16} style={{ color: 'rgba(6,182,212,0.3)' }} />
              <Zap
                size={20}
                style={{
                  color: 'rgba(6,182,212,0.6)',
                  filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))',
                }}
              />
              <ChevronDown size={16} style={{ color: 'rgba(124,58,237,0.3)' }} />
            </div>

            {/* Increment button */}
            <motion.button
              onClick={handleIncrement}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon-cyan relative flex flex-col items-center justify-center rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                width: '5rem',
                height: '5rem',
                fontSize: '1.75rem',
              }}
              aria-label="Sumar 1 punto"
            >
              <Plus size={28} strokeWidth={2.5} />
              <span
                className="absolute -bottom-6 text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'rgba(6,182,212,0.5)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                }}
              >
                [ + ]
              </span>
            </motion.button>
          </div>

          {/* Keyboard hint */}
          <p
            className="mt-12 text-xs relative z-10"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(6,182,212,0.25)',
              letterSpacing: '0.15em',
            }}
          >
            ATAJOS: [ + ] / [ - ]
          </p>
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center gap-3"
        >
          {error ? (
            <>
              <WifiOff size={12} className="text-red-400" />
              <span
                className="text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(248,113,113,0.7)' }}
              >
                {error}
              </span>
            </>
          ) : (
            <>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Activity size={12} style={{ color: 'rgba(124,58,237,0.6)' }} />
              </motion.div>
              <span
                className="text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(124,58,237,0.35)' }}
              >
                {loading ? 'CONECTANDO...' : `ADMIN ACTIVO · ${actionCount} OPERACIONES`}
              </span>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Wifi size={12} style={{ color: 'rgba(6,182,212,0.4)' }} />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
