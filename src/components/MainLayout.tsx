import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { 
  Home, 
  Trees, 
  Sprout, 
  Tractor, 
  Sun, 
  BookOpen, 
  Puzzle, 
  Bot, 
  User 
} from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const tabs = [
    { path: '/app', icon: Home, label: t('nav.home') },
    { path: '/app/stocks', icon: Trees, label: t('nav.stocks') },
    { path: '/app/sip', icon: Sprout, label: t('nav.sip') },
    { path: '/app/portfolio', icon: Tractor, label: t('nav.portfolio') },
    { path: '/app/simulations', icon: Sun, label: t('nav.simulations') },
    { path: '/app/learn', icon: BookOpen, label: t('nav.learn') },
    { path: '/app/puzzles', icon: Puzzle, label: t('nav.puzzles') },
    { path: '/app/ai-review', icon: Bot, label: 'AI Review' },
    { path: '/app/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </div>

      <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe z-50">
        <div className="flex overflow-x-auto hide-scrollbar px-2 py-3">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`relative flex flex-col items-center justify-center min-w-[72px] px-2 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'text-brand-emerald scale-105' : 'text-gray-400 hover:text-brand-emerald hover:bg-gray-50/50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-brand-emerald/15 rounded-xl nav-glow"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-6 h-6 mb-1 z-10 transition-all duration-300 ${isActive ? 'fill-brand-emerald/20 stroke-brand-emerald' : 'stroke-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] z-10 transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
