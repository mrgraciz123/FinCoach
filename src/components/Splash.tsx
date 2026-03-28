import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sprout, Sparkles, ArrowRight, Lock, ShieldCheck, Tractor } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      navigate('/app');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-navy text-white relative overflow-hidden px-6">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-emerald rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-brand-emerald-dark rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center z-10 w-full max-w-md"
      >
        <div className="relative mb-12">
          <motion.div 
            initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-gradient-to-br from-brand-emerald to-brand-emerald-dark p-6 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.5)] border border-white/20 relative z-10"
          >
            <Sprout className="w-20 h-20 text-white" strokeWidth={1.5} />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            className="absolute -top-3 -right-3 bg-brand-gold p-2.5 rounded-full shadow-xl z-20 border-2 border-brand-navy"
          >
            <Tractor className="w-6 h-6 text-brand-navy" />
          </motion.div>
        </div>
        
        <div className="text-center mb-12 w-full">
          <h1 className="text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-gold">Farm</span>
          </h1>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-2 px-5 inline-flex items-center shadow-xl">
            <Sparkles className="w-4 h-4 text-brand-gold mr-2" />
            <p className="text-gray-300 text-sm font-bold tracking-widest uppercase">
              Grow Your Wealth
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full space-y-6 bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="space-y-5 relative z-10">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-emerald transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="Enter your PIN" 
                className="w-full pl-14 pr-5 py-5 bg-brand-navy-light/40 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 focus:border-brand-emerald transition-all font-mono text-xl tracking-[0.5em] text-center shadow-inner"
                defaultValue="••••"
                readOnly
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center py-5 px-6 border border-transparent rounded-2xl text-lg font-extrabold text-brand-navy bg-gradient-to-r from-brand-emerald to-brand-gold hover:from-green-400 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-emerald transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <div className="flex items-center space-x-3">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                    className="w-2.5 h-2.5 bg-brand-navy rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                    className="w-2.5 h-2.5 bg-brand-navy rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                    className="w-2.5 h-2.5 bg-brand-navy rounded-full"
                  />
                </div>
              ) : (
                <>
                  Enter Farm <ArrowRight className="ml-3 w-6 h-6" />
                </>
              )}
            </button>
          </div>
          
          <div className="pt-2 text-center relative z-10">
            <p className="text-xs text-gray-500 font-medium flex items-center justify-center uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-brand-emerald" /> Secured by Bank-Grade Encryption
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
