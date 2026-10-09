import React from 'react';
import { Play, Sparkles, CheckCircle2, ExternalLink, Flame, Clock, Award } from 'lucide-react';
import type { UserProfile, AppSettings, TaskItem, Language } from '../types';

interface EarnViewProps {
  user: UserProfile;
  settings: AppSettings;
  tasks: TaskItem[];
  lang: Language;
  onWatchAd: () => void;
  onClaimDaily: () => void;
  onCompleteTask: (taskId: string) => void;
  cooldownRemaining: number;
}

export const EarnView: React.FC<EarnViewProps> = ({
  user,
  settings,
  tasks,
  lang,
  onWatchAd,
  onClaimDaily,
  onCompleteTask,
  cooldownRemaining,
}) => {
  const isCooldown = cooldownRemaining > 0;
  const isLimitReached = user.adsWatchedToday >= settings.dailyAdLimit;

  return (
    <div className="space-y-4 px-4 pb-24 animate-fadeIn">
      {/* Monetag Rewarded Ads Zone 10195941 Feature Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18112e] via-[#101426] to-[#0a0d18] border border-purple-500/30 p-4.5 shadow-[0_0_30px_rgba(147,51,234,0.25)]">
        {/* Glow ambient background circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-3.5">
          {/* Ad Reward Chest Graphic Asset */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-purple-950/40 border border-purple-500/40 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <img
              src="/src/assets/images/monetag_ads_chest_1791554080546.jpg"
              alt="Monetag Ad Rewards"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-700/50">
                Monetag Zone {settings.monetagZoneId}
              </span>
            </div>

            <h2 className="mt-1 text-base font-bold text-white tracking-tight">
              {lang === 'bn' ? 'বিজ্ঞাপন দেখে আয় করুন' : 'Watch Monetag Rewarded Ads'}
            </h2>

            <p className="mt-0.5 text-xs text-slate-400 leading-snug">
              {lang === 'bn'
                ? `প্রতি বিজ্ঞাপনে +${settings.rewardPerAd} Yuze Coins ($${settings.usdtEquivalentPerAd} USDT) আর্ন করুন`
                : `Watch a short 15s sponsored ad & get +${settings.rewardPerAd} Yuze Coins ($${settings.usdtEquivalentPerAd} USDT)`}
            </p>
          </div>
        </div>

        {/* Progress & Daily Watch Tracker */}
        <div className="mt-3.5 pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {lang === 'bn' ? 'আজকের লিমিট:' : 'Daily Limit:'}{' '}
              <strong className="text-white font-mono-nums">
                {user.adsWatchedToday} / {settings.dailyAdLimit}
              </strong>
            </span>
          </div>

          <div className="text-[11px] text-emerald-400 font-mono-nums flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>+{(user.adsWatchedToday * settings.rewardPerAd).toLocaleString()} Coins Earned</span>
          </div>
        </div>

        {/* Watch Ad Main Action Button */}
        <div className="mt-3">
          <button
            type="button"
            disabled={isCooldown || isLimitReached}
            onClick={onWatchAd}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
              isLimitReached
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isCooldown
                ? 'bg-purple-950/80 border border-purple-800/60 text-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_24px_rgba(168,85,247,0.5)] border border-purple-400/30'
            }`}
          >
            {isLimitReached ? (
              <span>{lang === 'bn' ? 'আজকের লিমিট পূর্ণ' : 'Daily Limit Reached'}</span>
            ) : isCooldown ? (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                <span>
                  {lang === 'bn' ? `অপেক্ষা করুন (${cooldownRemaining}s)` : `Cooldown: ${cooldownRemaining}s`}
                </span>
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-purple-200" />
                <span>
                  {lang === 'bn'
                    ? `বিজ্ঞাপন দেখুন (+${settings.rewardPerAd} কয়েন)`
                    : `Watch Ad (+${settings.rewardPerAd} Coins)`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Daily Check-in Streak Bonus Card */}
      <div className="rounded-2xl bg-[#0d1222] border border-slate-800/80 p-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{lang === 'bn' ? 'দৈনিক স্ট্রিক বোনাস' : 'Daily Streak Bonus'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono-nums">
                  Day {user.streakDays}/7
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'প্রতিদিন অ্যাপে এসে কয়েন ক্লেইম করুন' : 'Claim free Yuze coins every 24 hours'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClaimDaily}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs shadow-[0_0_12px_rgba(234,179,8,0.4)] transition-all cursor-pointer active:scale-95"
          >
            {lang === 'bn' ? 'ক্লেইম' : 'Claim +200'}
          </button>
        </div>
      </div>

      {/* Quests & Tasks Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'bn' ? 'টাস্ক এবং মিশন' : 'Quests & Missions'}</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono-nums">
            {tasks.filter((t) => t.completed).length} / {tasks.length} {lang === 'bn' ? 'সম্পূর্ণ' : 'Done'}
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-2xl p-3 flex items-center justify-between gap-3 border transition-all ${
                task.completed
                  ? 'bg-[#0a0e19]/60 border-slate-800/40 opacity-70'
                  : 'bg-[#0e1424] border-slate-800 hover:border-purple-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    task.completed
                      ? 'bg-emerald-950/40 text-emerald-400'
                      : 'bg-purple-950/40 text-purple-300 border border-purple-800/40'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">⚡</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {lang === 'bn' ? task.titleBn : task.titleEn}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono-nums flex items-center gap-1">
                    <span>+{task.reward} Yuze Coins</span>
                    {task.targetCount && (
                      <span className="text-slate-500">
                        ({task.currentCount || 0}/{task.targetCount})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {task.completed ? (
                  <span className="text-[11px] text-emerald-400 font-medium px-2 py-1">
                    {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCompleteTask(task.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700/50 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    <span>{lang === 'bn' ? 'শুরু' : 'Start'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
