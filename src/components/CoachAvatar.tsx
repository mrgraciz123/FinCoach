import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export type CoachState = 'idle' | 'happy' | 'thinking' | 'concerned' | 'celebrate';

interface CoachAvatarProps {
  state?: CoachState;
  message?: string;
  className?: string;
}

export default function CoachAvatar({ state = 'idle', message, className = '' }: CoachAvatarProps) {
  useEffect(() => {
    if (state === 'celebrate') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#eab308', '#84CC16', '#fef08a']
      });
    }
  }, [state]);

  const getEmoji = () => {
    switch (state) {
      case 'happy': return '🧑‍🌾';
      case 'celebrate': return '🌻';
      case 'concerned': return '🥀';
      case 'thinking': return '🤔';
      case 'idle':
      default: return '👨‍🌾';
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'happy':
        return { y: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } };
      case 'celebrate':
        return { y: [0, -15, 0], rotate: [0, -10, 10, -10, 10, 0], transition: { repeat: Infinity, duration: 1.5 } };
      case 'concerned':
        return { x: [-2, 2, -2], transition: { repeat: Infinity, duration: 0.5 } };
      case 'thinking':
        return { rotate: [0, 5, 0], transition: { repeat: Infinity, duration: 3 } };
      case 'idle':
      default:
        return { y: [0, -5, 0], transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' } };
    }
  };

  return (
    <div className={`flex items-end space-x-3 ${className}`}>
      <motion.div
        animate={getAnimation()}
        className="w-16 h-16 bg-gradient-to-br from-brand-emerald to-brand-navy-light rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-white relative flex-shrink-0 z-10"
      >
        {getEmoji()}
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
        </div>
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          key={message}
          className="bg-white px-5 py-4 rounded-3xl rounded-bl-none shadow-xl border border-gray-100 max-w-[240px] relative"
        >
          <p className="text-sm font-bold text-brand-navy leading-snug">{message}</p>
          <p className="text-[10px] text-brand-soil font-extrabold uppercase tracking-widest mt-2">Farmer Vihaan</p>
        </motion.div>
      )}
    </div>
  );
}
