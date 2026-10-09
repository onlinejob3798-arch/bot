import React, { useState } from 'react';
import { Trophy, Clock, Medal, Sparkles, ChevronRight } from 'lucide-react';
import type { LeaderboardUser, Language } from '../types';

interface LeaderboardViewProps {
  leaderboard: LeaderboardUser[];
  userPoints: number;
  userRank: number;
  lang: Language;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboard,
  userPoints,
  userRank,
  lang,
}) => {
  const [selectedLeague, setSelectedLeague] = useState('Super League');

  return (
    <div className="space-y-4 px-4 pb-24 animate-fadeIn">
      {/* Super Prize Banner with Trophy Image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c1236] via-[#101428] to-[#090d18] border border-purple-500/30 p-4.5 shadow-[0_0_35px_rgba(147,51,234,0.3)] text-center">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* 3D Champion Trophy Asset */}
        <div className="w-24 h-24 mx-auto mb-2 relative">
          <img
            src="/src/assets/images/kombat_trophy_1791554047913.jpg"
            alt="Super Prize Trophy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] rounded-2xl"
          />
        </div>

        <h2 className="text-lg font-extrabold text-white tracking-tight leading-snug">
          {lang === 'bn'
            ? '১০০,০০০ Yuze Coins সুপার প্রাইজের অংশ দাবি করুন!'
            : 'Claim Your Share of the 100,000 Yuze Coins Super Prize!'}
        </h2>

        <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          {lang === 'bn'
            ? 'লিডারবোর্ড প্রতি ৭ দিনে আপডেট হয়। প্রাইজপুলে নিজের স্থান নিশ্চিত করতে বাকি আছে ৫ দিন ২৩ ঘণ্টা।'
            : 'The leaderboard updates every 7 days. You still have 5d:23h:12m left to secure your spot and win the prize pool.'}
        </p>

        {/* League Selector Pill */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{selectedLeague}</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl bg-[#0b0f1a] border border-slate-800/80 p-3 shadow-md">
        <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2 border-b border-slate-800">
          <div className="col-span-2">Place</div>
          <div className="col-span-6">Nickname</div>
          <div className="col-span-4 text-right">Points earned</div>
        </div>

        <div className="mt-2 divide-y divide-slate-800/50">
          {leaderboard.map((item) => {
            const isTop3 = item.place <= 3;
            const placeBadgeClass =
              item.place === 1
                ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                : item.place === 2
                ? 'bg-slate-300 text-black shadow-[0_0_10px_rgba(203,213,225,0.5)]'
                : item.place === 3
                ? 'bg-amber-700 text-white shadow-[0_0_10px_rgba(180,83,9,0.5)]'
                : 'text-slate-400 font-mono-nums';

            return (
              <div
                key={item.place}
                className={`grid grid-cols-12 items-center py-2.5 px-3 rounded-xl transition-colors ${
                  item.isCurrentUser
                    ? 'bg-purple-950/40 border border-purple-600/40 text-white'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                {/* Place */}
                <div className="col-span-2 flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${placeBadgeClass}`}
                  >
                    {item.place}
                  </div>
                </div>

                {/* Nickname */}
                <div className="col-span-6 flex items-center gap-1.5 truncate">
                  <span
                    className={`text-xs font-semibold truncate ${
                      item.isCurrentUser ? 'text-purple-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    {item.nickname}
                  </span>
                  {item.badge && <span className="text-xs">{item.badge}</span>}
                  {item.isCurrentUser && (
                    <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1 rounded font-mono">
                      YOU
                    </span>
                  )}
                </div>

                {/* Points */}
                <div className="col-span-4 text-right font-mono-nums text-xs font-bold text-slate-100 flex items-center justify-end gap-1">
                  <span className="text-[10px] text-purple-400">⚡</span>
                  <span>{item.points.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
