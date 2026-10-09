import React from 'react';
import { ShieldCheck, MessageCircle, Globe, MoreHorizontal, Copy, Check } from 'lucide-react';
import type { UserProfile, Language } from '../types';

interface HeaderProps {
  user: UserProfile;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAdmin: () => void;
  onOpenSupport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  lang,
  onLanguageChange,
  onOpenAdmin,
  onOpenSupport,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyProfileId = () => {
    navigator.clipboard.writeText(user.telegramId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="relative z-20 px-4 pt-3 pb-2 bg-gradient-to-b from-[#0b0f1a] to-transparent">
      {/* Telegram App Bar (Top Bar) */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-slate-400 hover:text-white px-2 py-1.5 transition-colors font-medium cursor-pointer"
        >
          {lang === 'bn' ? 'বাতিল' : 'Cancel'}
        </button>

        {/* Bot Name with Blue Verification Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800/80 rounded-full backdrop-blur-sm">
          <span className="font-bold text-white text-xs tracking-wide">YUZEFA</span>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-500/20" />
          <span className="text-[10px] text-slate-400">bot</span>
        </div>

        {/* Right Actions: Support, Language, More */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSupport}
            className="flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 px-2.5 py-1 rounded-full transition-all cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 text-purple-400" />
            <span>{lang === 'bn' ? 'সাপোর্ট' : 'Support'}</span>
          </button>

          <button
            type="button"
            onClick={() => onLanguageChange(lang === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 px-2 py-1 rounded-full transition-all cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold uppercase">{lang}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-full transition-all cursor-pointer"
            title="Admin & Settings"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Hero Profile matching the reference image */}
      <div className="mt-4 flex flex-col items-center">
        {/* Avatar with Glowing Ring and Rank Badge */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0e17] border-2 border-[#0f172a]">
              <img
                src={user.avatarUrl}
                alt={user.username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback avatar if local path issue
                  (e.target as HTMLImageElement).src =
                    'https://api.dicebear.com/7.x/bottts/svg?seed=Boro9191';
                }}
              />
            </div>
          </div>

          {/* Glowing Rank Badge "1" */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-black font-extrabold text-xs flex items-center justify-center shadow-lg border-2 border-[#090d16]">
            {user.rank}
          </div>
        </div>

        {/* Username */}
        <h1 className="mt-2.5 text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
          {user.username}
        </h1>

        {/* Profile ID with click to copy */}
        <button
          type="button"
          onClick={copyProfileId}
          className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>Profile ID - {user.telegramId}</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 text-slate-500 group-hover:text-purple-400 transition-colors" />
          )}
        </button>
      </div>
    </header>
  );
};
