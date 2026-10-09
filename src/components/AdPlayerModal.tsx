import React, { useState, useEffect } from 'react';
import { X, Play, Sparkles, CheckCircle2, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Language } from '../types';

interface AdPlayerModalProps {
  isOpen: boolean;
  zoneId: string;
  rewardCoins: number;
  usdtReward: number;
  lang: Language;
  onClose: () => void;
  onRewardEarned: () => void;
}

export const AdPlayerModal: React.FC<AdPlayerModalProps> = ({
  isOpen,
  zoneId,
  rewardCoins,
  usdtReward,
  lang,
  onClose,
  onRewardEarned,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(15);
      setIsCompleted(false);
      return;
    }

    setSecondsLeft(15);
    setIsCompleted(false);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          // Trigger confetti!
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#a855f7', '#6366f1', '#eab308', '#06b6d4'],
            });
          } catch (e) {
            // ignore if blocked
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    onRewardEarned();
    onClose();
  };

  const progressPercent = ((15 - secondsLeft) / 15) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[#090d18] border border-purple-500/40 overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.4)] relative flex flex-col">
        {/* Ad Header */}
        <div className="flex items-center justify-between p-3.5 bg-[#0e1424] border-b border-purple-900/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-white tracking-wide">
              Monetag Rewarded SDK
            </span>
            <span className="text-[10px] text-purple-300 font-mono bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700/50">
              Zone: {zoneId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white p-1"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            {isCompleted && (
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800 w-full">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Ad Video / Creative Area */}
        <div className="relative aspect-video bg-gradient-to-br from-[#120f26] via-[#0b1228] to-[#080d1a] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-radial-gradient from-purple-600/10 via-transparent to-transparent animate-pulse" />

          {/* Ad Creative Centerpiece */}
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <div className="w-full h-full bg-[#0b0e18] rounded-2xl flex items-center justify-center text-2xl">
                ⚡
              </div>
            </div>

            <h4 className="mt-3 text-sm font-bold text-white tracking-wide">
              YUZEFA Kombat Web3 Hub
            </h4>
            <p className="mt-1 text-[11px] text-slate-400 max-w-[200px] mx-auto leading-tight">
              Instant Rewards • Fair Gaming • Verified Monetag Network
            </p>
          </div>

          {/* Timer Overlay / Completed Overlay */}
          {!isCompleted ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/40 text-[11px] font-mono font-bold text-purple-300 flex items-center gap-1.5">
              <span>Reward in:</span>
              <span className="text-amber-300">{secondsLeft}s</span>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              <div className="mt-2 text-base font-extrabold text-white">
                {lang === 'bn' ? 'বিজ্ঞাপন দেখা সম্পূর্ণ!' : 'Ad Watch Complete!'}
              </div>
              <div className="text-xs text-amber-300 font-mono font-bold mt-0.5">
                +{rewardCoins} Yuze Coins (+${usdtReward} USDT)
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#0a0e1a] border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {isCompleted ? (
              <span className="text-emerald-400 font-semibold">
                {lang === 'bn' ? 'পুরস্কার প্রস্তুত!' : 'Reward unlocked!'}
              </span>
            ) : (
              <span>
                {lang === 'bn' ? 'পুরস্কার পেতে পুরো দেখুন' : 'Watch full 15s to claim'}
              </span>
            )}
          </div>

          {isCompleted ? (
            <button
              type="button"
              onClick={handleClaim}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all cursor-pointer active:scale-95"
            >
              {lang === 'bn' ? 'ক্লেইম করুন' : 'Claim Reward'}
            </button>
          ) : (
            <div className="text-xs text-slate-500 font-mono">
              Wait {secondsLeft}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
