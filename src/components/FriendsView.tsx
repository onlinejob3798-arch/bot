import React, { useState } from 'react';
import { Users, Copy, Check, Share2, Sparkles, Gift, ArrowRight } from 'lucide-react';
import type { UserProfile, ReferralFriend, Language } from '../types';

interface FriendsViewProps {
  user: UserProfile;
  friends: ReferralFriend[];
  lang: Language;
  onClaimReferralEarnings: () => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  user,
  friends,
  lang,
  onClaimReferralEarnings,
}) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://t.me/yuzefa_bot?start=${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent(
      `🔥 Join YUZEFA Kombat on Telegram! Watch ads to earn USDT & play Kombat battles! Claim 500 bonus coins with my link: ${referralLink}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 px-4 pb-24 animate-fadeIn">
      {/* Referral Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#191130] via-[#101428] to-[#090d18] border border-purple-500/30 p-4.5 shadow-[0_0_30px_rgba(147,51,234,0.25)]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
            👥
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              {lang === 'bn' ? 'বন্ধুদের ইনভাইট করে আয় করুন' : 'Invite Friends & Earn Big'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">
              {lang === 'bn'
                ? 'প্রতিটি রেফারেলে +৫০০ কয়েন এবং বন্ধুদের বিজ্ঞাপন আয়ের ১০% আজীবন কমিশন পান।'
                : 'Get +500 Coins for each friend + 10% lifetime commission on their ad watch earnings.'}
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-purple-900/40">
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/30 text-center">
            <div className="text-[10px] text-slate-400">Total Referrals</div>
            <div className="font-mono-nums font-bold text-white text-base mt-0.5">
              {user.referralsCount} {lang === 'bn' ? 'জন' : 'Users'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/30 text-center">
            <div className="text-[10px] text-slate-400">Total Referral Earnings</div>
            <div className="font-mono-nums font-bold text-amber-300 text-base mt-0.5">
              +{user.referralEarnings.toLocaleString()} Coins
            </div>
          </div>
        </div>

        {/* Invite Link Box */}
        <div className="mt-4">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
            {lang === 'bn' ? 'আপনার রেফারেল লিংক:' : 'Your Unique Invite Link:'}
          </div>
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-[#090d16] border border-slate-800">
            <span className="text-xs text-slate-300 font-mono truncate flex-1">
              {referralLink}
            </span>
            <button
              type="button"
              onClick={copyLink}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer shrink-0"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Share Button on Telegram */}
        <button
          type="button"
          onClick={shareOnTelegram}
          className="mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-98"
        >
          <Share2 className="w-4 h-4" />
          <span>{lang === 'bn' ? 'টেলিগ্রামে বন্ধুদের শেয়ার করুন' : 'Share on Telegram'}</span>
        </button>
      </div>

      {/* Claimable Referral Bonus Card */}
      <div className="rounded-2xl bg-[#0d1222] border border-slate-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {lang === 'bn' ? 'রেফারেল কমিশন ক্লেইম' : 'Claim Referral Commission'}
            </div>
            <div className="text-[11px] text-amber-300 font-mono-nums">
              +1,250 Coins Available
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClaimReferralEarnings}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
        >
          {lang === 'bn' ? 'ক্লেইম করুন' : 'Claim Now'}
        </button>
      </div>

      {/* Friends List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'bn' ? 'আমন্ত্রিত বন্ধুরা' : 'Invited Friends'}</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono-nums">
            {friends.length} Friends
          </span>
        </div>

        <div className="space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="rounded-2xl bg-[#0c1120] border border-slate-800/80 p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                  {friend.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{friend.name}</div>
                  <div className="text-[10px] text-slate-400">@{friend.username} · {friend.joinedDate}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-amber-400 font-mono-nums">
                  +{friend.earnedCoins}
                </div>
                <div className="text-[9px] text-emerald-400">Active</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
