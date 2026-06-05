/**
 * AnimatedCounter — Massive neon number display with Framer Motion
 * Design: Void Terminal — Cyberpunk Glassmorphism
 *
 * Uses spring physics for smooth number transitions.
 * Digits animate individually for a "ticker" effect.
 */

import { motion, useSpring, useTransform } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

// Individual digit component with spring animation
function AnimatedDigit({ digit, index }: { digit: string; index: number }) {
  const isNumber = /\d/.test(digit);

  if (!isNumber) {
    return (
      <span className="inline-block" style={{ fontFamily: 'inherit' }}>
        {digit}
      </span>
    );
  }

  return (
    <motion.span
      key={`${digit}-${index}`}
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      transition={{
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
        delay: index * 0.03,
      }}
      className="inline-block tabular-nums"
      style={{ fontFamily: 'inherit' }}
    >
      {digit}
    </motion.span>
  );
}

// Spring-based smooth number display
function SpringNumber({ value }: { value: number }) {
  const spring = useSpring(value, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });

  const display = useTransform(spring, (v) => Math.round(v).toLocaleString('es-ES'));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className="tabular-nums" style={{ fontFamily: 'inherit' }}>
      {display}
    </motion.span>
  );
}

export function AnimatedCounter({ value, className = '', style }: AnimatedCounterProps) {
  const prevRef = useRef(value);
  const direction = value > prevRef.current ? 1 : value < prevRef.current ? -1 : 0;

  useEffect(() => {
    prevRef.current = value;
  }, [value]);

  return (
    <motion.div
      className={className}
      style={style}
      animate={{
        scale: direction !== 0 ? [1, 1.02, 1] : 1,
      }}
      transition={{
        duration: 0.35,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <SpringNumber value={value} />
    </motion.div>
  );
}
