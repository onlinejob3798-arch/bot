import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Trophy, Swords } from 'lucide-react';
import type { UserProfile, Language } from '../types';

interface BalanceCardsProps {
  user: UserProfile;
  lang: Language;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onExchange: () => void;
}

export const BalanceCards: React.FC<BalanceCardsProps> = ({
  user,
  lang,
  onOpenDeposit,
  onOpenWithdraw,
  onExchange,
}) => {
  return (
    <div className="space-y-3 px-4">
      {/* Dual Token Balances Grid (YUZE Coins & Kombats Coins) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* YUZE Coins Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0e1322]/90 border border-purple-900/30 p-3.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="text-[11px] font-medium text-slate-400">YUZE Coins</div>
          <div className="mt-1.5 flex items-center gap-2">
            {/* Glowing Golden Yuze Coin Badge */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-extrabold text-[12px] flex items-center justify-center shadow-[0_0_12px_rgba(234,179,8,0.5)] shrink-0">
              Y
            </div>
            <div className="font-mono-nums text-lg font-bold text-white tracking-tight">
              {user.yuzeCoins.toLocaleString()}
            </div>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 font-mono-nums">
            ≈ ${(user.yuzeCoins * 0.001).toFixed(2)} USDT
          </div>
        </div>

        {/* Kombat Coins Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0e1322]/90 border border-purple-900/30 p-3.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Kombats Coins</div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-extrabold text-[10px] flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.5)] shrink-0">
                ⚡
              </div>
              <div className="font-mono-nums text-lg font-bold text-white tracking-tight">
                {user.kombatCoins.toLocaleString()}
              </div>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono-nums truncate">
              ≈ {(user.kombatCoins * 0.009917).toFixed(6)} USDT
            </div>
          </div>

          <button
            type="button"
            onClick={onExchange}
            className="mt-2 self-end flex items-center gap-1 text-[10px] font-medium text-purple-400 hover:text-purple-300 bg-purple-950/50 hover:bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-800/40 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-2.5 h-2.5" />
            <span>Exchange</span>
          </button>
        </div>
      </div>

      {/* Main Wallet Row: USDT Balance + Deposit & Withdraw Buttons */}
      <div className="rounded-2xl bg-gradient-to-b from-[#111728] to-[#0d1220] border border-slate-800/80 p-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Tether / USDT Icon */}
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center">
              ₮
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                {lang === 'bn' ? 'ইউএসডিটি ওয়ালেট' : 'USDT Balance'}
              </div>
              <div className="font-mono-nums text-xl font-bold text-white tracking-tight">
                {user.usdtBalance.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">USDT</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Withdraw & Deposit */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenWithdraw}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold tracking-wide shadow-sm hover:border-slate-600 transition-all cursor-pointer active:scale-95"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'bn' ? 'উইথড্র' : 'Withdraw'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenDeposit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold tracking-wide shadow-[0_0_18px_rgba(147,51,234,0.45)] transition-all cursor-pointer active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-200" />
              <span>{lang === 'bn' ? 'ডিপোজিট' : 'Deposit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* League & Battle Stats Card (Matching reference UI) */}
      <div className="rounded-2xl bg-[#0b0f1a]/95 border border-purple-900/20 p-3.5 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400 font-medium">League</span>
          </div>
          <span className="text-xs font-bold bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            {user.league}
          </span>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-center">
          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Swords className="w-2.5 h-2.5 text-blue-400" />
              <span>Battles</span>
            </div>
            <div className="mt-1 font-mono-nums text-xs font-bold text-white">
              {user.battles}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-2.5 h-2.5 text-yellow-400" />
              <span>Victories</span>
            </div>
            <div className="mt-1 font-mono-nums text-xs font-bold text-emerald-400">
              {user.victories}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[8px] flex items-center justify-center">
                Y
              </span>
              <span>Lost</span>
            </div>
            <div className="mt-1 font-mono-nums text-xs font-bold text-rose-400">
              {user.lost.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-[8px] flex items-center justify-center">
                Y
              </span>
              <span>Earned</span>
            </div>
            <div className="mt-1 font-mono-nums text-xs font-bold text-yellow-300">
              {user.earned.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
