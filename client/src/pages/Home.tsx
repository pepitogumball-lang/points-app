/**
 * Home page — Public view
 * Design: Void Terminal — Cyberpunk Glassmorphism
 *
 * Features:
 * - Massive neon counter (read-only)
 * - Glassmorphism card with radial glow
 * - Realtime updates via Supabase
 * - Framer Motion entrance animations
 */

import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { usePoints } from '@/hooks/usePoints';
import { motion } from 'framer-motion';
import { Activity, Wifi, WifiOff } from 'lucide-react';

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { points, loading, error } = usePoints();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#020617' }}
    >
      {/* Particle canvas background */}
      <ParticleBackground />

      {/* Radial gradient orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          inset: 0,
          zIndex: 1,
          background: `
            radial-gradient(ellipse 70% 50% at 30% 40%, rgba(6,182,212,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 70% 60%, rgba(124,58,237,0.07) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-12">

        {/* Header label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-2 mb-8"
        >
          <Activity
            size={14}
            className="text-cyan-400"
            style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.8))' }}
          />
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(6,182,212,0.7)',
              letterSpacing: '0.3em',
            }}
          >
            SISTEMA DE PUNTOS
          </span>
          <Activity
            size={14}
            className="text-cyan-400"
            style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.8))' }}
          />
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="glass-card scanlines relative flex flex-col items-center justify-center px-12 py-14 sm:px-20 sm:py-16 animate-breathe-cyan"
          style={{
            minWidth: 'min(90vw, 520px)',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Points label */}
          <p
            className="text-xs tracking-[0.4em] uppercase mb-6 relative z-10"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(124,58,237,0.8)',
              textShadow: '0 0 10px rgba(124,58,237,0.5)',
            }}
          >
            PUNTOS TOTALES
          </p>

          {/* Counter */}
          <div className="relative z-10">
            {loading ? (
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="font-mono-display neon-text-cyan"
                style={{
                  fontSize: 'clamp(5rem, 18vw, 14rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                ···
              </motion.div>
            ) : (
              <AnimatedCounter
                value={points ?? 0}
                className="font-mono-display neon-text-cyan animate-pulse-glow"
                style={{
                  fontSize: 'clamp(5rem, 18vw, 14rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              />
            )}
          </div>

          {/* Divider */}
          <div
            className="w-full mt-8 mb-6 relative z-10"
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(124,58,237,0.3), transparent)',
            }}
          />

          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 relative z-10"
          >
            {error ? (
              <>
                <WifiOff size={12} className="text-red-400" />
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'rgba(248,113,113,0.8)',
                  }}
                >
                  {error}
                </span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wifi size={12} style={{ color: 'rgba(6,182,212,0.7)' }} />
                </motion.div>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'rgba(6,182,212,0.5)',
                  }}
                >
                  {loading ? 'CONECTANDO...' : 'EN VIVO'}
                </span>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 text-xs"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(6,182,212,0.2)',
            letterSpacing: '0.2em',
          }}
        >
          POINTS v1.0 — REALTIME
        </motion.p>
      </div>
    </div>
  );
}
