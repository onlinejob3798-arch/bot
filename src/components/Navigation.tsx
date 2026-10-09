import React from 'react';
import { User, Gift, Trophy, Users, Flame } from 'lucide-react';
import type { Language } from '../types';

export type NavTab = 'account' | 'earn' | 'kombat' | 'leaders' | 'friends';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  lang,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-purple-900/30 px-3 py-1.5 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center relative">
        {/* Tab 1: Account */}
        <button
          type="button"
          onClick={() => onTabChange('account')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            currentTab === 'account' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentTab === 'account' ? 'bg-purple-950/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : ''
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            {lang === 'bn' ? 'অ্যাকাউন্ট' : 'Account'}
          </span>
        </button>

        {/* Tab 2: Earn */}
        <button
          type="button"
          onClick={() => onTabChange('earn')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            currentTab === 'earn' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentTab === 'earn' ? 'bg-purple-950/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : ''
            }`}
          >
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            {lang === 'bn' ? 'আর্ন' : 'Earn'}
          </span>
        </button>

        {/* Tab 3: Center Floating Fist (Kombat / Tap) */}
        <div className="flex flex-col items-center -mt-6">
          <button
            type="button"
            onClick={() => onTabChange('kombat')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 border-2 ${
              currentTab === 'kombat'
                ? 'bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 border-white shadow-[0_0_28px_rgba(168,85,247,0.8)]'
                : 'bg-gradient-to-tr from-purple-700 to-indigo-800 border-purple-400/40 shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]'
            }`}
            title="Kombat Arena"
          >
            {/* 3D Fist Icon / Emoji */}
            <span className="text-2xl filter drop-shadow-md transform active:rotate-12 transition-transform">
              ✊
            </span>
          </button>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1 text-slate-300">
            Kombat
          </span>
        </div>

        {/* Tab 4: Leaders */}
        <button
          type="button"
          onClick={() => onTabChange('leaders')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            currentTab === 'leaders' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentTab === 'leaders' ? 'bg-purple-950/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : ''
            }`}
          >
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            {lang === 'bn' ? 'লিডারস' : 'Leaders'}
          </span>
        </button>

        {/* Tab 5: Friends */}
        <button
          type="button"
          onClick={() => onTabChange('friends')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            currentTab === 'friends' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentTab === 'friends' ? 'bg-purple-950/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : ''
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            {lang === 'bn' ? 'ফ্রেন্ডস' : 'Friends'}
          </span>
        </button>
      </div>
    </nav>
  );
};
