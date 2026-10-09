/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BalanceCards } from './components/BalanceCards';
import { Navigation, type NavTab } from './components/Navigation';
import { EarnView } from './components/EarnView';
import { KombatView } from './components/KombatView';
import { LeaderboardView } from './components/LeaderboardView';
import { FriendsView } from './components/FriendsView';
import { WalletModals } from './components/WalletModals';
import { AdPlayerModal } from './components/AdPlayerModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { SupportModal } from './components/SupportModal';

import type {
  UserProfile,
  AppSettings,
  WithdrawalRequest,
  WithdrawalMethod,
  TaskItem,
  LeaderboardUser,
  ReferralFriend,
  Language,
} from './types';
import {
  DEFAULT_USER,
  DEFAULT_SETTINGS,
  INITIAL_LEADERBOARD,
  INITIAL_TASKS,
  INITIAL_FRIENDS,
  INITIAL_WITHDRAWALS,
} from './utils/initialData';
import {
  initFirebase,
  saveUserToFirestore,
  fetchUserFromFirestore,
  submitWithdrawalToFirestore,
  fetchWithdrawalsFromFirestore,
  updateWithdrawalStatusInFirestore,
} from './services/firebaseService';
import { canWatchAd, triggerMonetagAd } from './services/monetagService';

export default function App() {
  // Language
  const [lang, setLang] = useState<Language>('bn');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('account');

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('yuze_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.adminPin || parsed.adminPin === '1234') {
          parsed.adminPin = 'habib58gd';
        }
        return parsed;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('yuze_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('yuze_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  // Tasks & Leaderboard & Friends
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('yuze_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [friends, setFriends] = useState<ReferralFriend[]>(INITIAL_FRIENDS);

  // Modals state
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [adPlayerOpen, setAdPlayerOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  // Cooldown calculation state
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Telegram WebApp Initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      try {
        tg.setHeaderColor('#07090E');
        tg.setBackgroundColor('#07090E');
      } catch (e) {
        // unsupported in some older telegram desktop clients
      }

      // If user data available in Telegram initData
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setUser((prev) => ({
          ...prev,
          telegramId: tgUser.id.toString(),
          username: tgUser.username || prev.username,
          firstName: tgUser.first_name || prev.firstName,
          avatarUrl: tgUser.photo_url || prev.avatarUrl,
        }));
      }
    }
  }, []);

  // Firebase initialization if configured
  useEffect(() => {
    if (settings.firebaseConfig) {
      initFirebase(settings.firebaseConfig);
    }
  }, [settings.firebaseConfig]);

  // Sync user changes to storage/Firestore
  useEffect(() => {
    localStorage.setItem('yuze_current_user', JSON.stringify(user));
    saveUserToFirestore(user);
  }, [user]);

  // Sync settings
  useEffect(() => {
    localStorage.setItem('yuze_settings', JSON.stringify(settings));
  }, [settings]);

  // Cooldown interval timer
  useEffect(() => {
    const checkCooldown = () => {
      const check = canWatchAd(
        user.adsWatchedToday,
        user.lastAdWatchedAt,
        settings.dailyAdLimit,
        settings.adCooldownSeconds
      );
      setCooldownRemaining(check.remainingCooldown);
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [user.adsWatchedToday, user.lastAdWatchedAt, settings.dailyAdLimit, settings.adCooldownSeconds]);

  // Watch Monetag Ad Action
  const handleWatchAd = async () => {
    const check = canWatchAd(
      user.adsWatchedToday,
      user.lastAdWatchedAt,
      settings.dailyAdLimit,
      settings.adCooldownSeconds
    );

    if (!check.allowed) {
      showToast(check.reason || 'Cannot watch ad right now');
      return;
    }

    // Try direct Monetag SDK call first
    const directShown = await triggerMonetagAd(settings.monetagZoneId);
    if (directShown) {
      handleAdRewardSuccess();
    } else {
      // Show simulated Monetag player modal with unskippable timer
      setAdPlayerOpen(true);
    }
  };

  // When Monetag ad is fully watched
  const handleAdRewardSuccess = () => {
    const rewardCoins = settings.rewardPerAd;
    const rewardUsdt = settings.usdtEquivalentPerAd;

    setUser((prev) => ({
      ...prev,
      yuzeCoins: prev.yuzeCoins + rewardCoins,
      usdtBalance: parseFloat((prev.usdtBalance + rewardUsdt).toFixed(4)),
      adsWatchedToday: prev.adsWatchedToday + 1,
      totalAdsWatched: prev.totalAdsWatched + 1,
      lastAdWatchedAt: Date.now(),
      earned: prev.earned + rewardCoins,
    }));

    showToast(
      lang === 'bn'
        ? `অভিনন্দন! +${rewardCoins} Yuze Coins ($${rewardUsdt} USDT) যোগ হয়েছে!`
        : `Success! +${rewardCoins} Yuze Coins ($${rewardUsdt} USDT) credited!`
    );
  };

  // Daily Streak Check-in
  const handleClaimDaily = () => {
    const streakReward = 200;
    setUser((prev) => ({
      ...prev,
      yuzeCoins: prev.yuzeCoins + streakReward,
      streakDays: prev.streakDays < 7 ? prev.streakDays + 1 : 1,
      lastDailyClaim: new Date().toISOString(),
      earned: prev.earned + streakReward,
    }));

    showToast(
      lang === 'bn'
        ? `দৈনিক বোনাস +${streakReward} Yuze Coins ক্লেইম করা হয়েছে!`
        : `Daily Streak +${streakReward} Coins Claimed!`
    );
  };

  // Quest / Task completion
  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    if (task.link) {
      window.open(task.link, '_blank');
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
    setUser((prev) => ({
      ...prev,
      yuzeCoins: prev.yuzeCoins + task.reward,
      earned: prev.earned + task.reward,
    }));

    showToast(
      lang === 'bn'
        ? `মিশন সম্পন্ন! +${task.reward} Yuze Coins পুরস্কৃত!`
        : `Mission Complete! +${task.reward} Yuze Coins awarded!`
    );
  };

  // Referral Earnings Claim
  const handleClaimReferralEarnings = () => {
    const referralAmount = 1250;
    setUser((prev) => ({
      ...prev,
      yuzeCoins: prev.yuzeCoins + referralAmount,
      referralEarnings: prev.referralEarnings + referralAmount,
      earned: prev.earned + referralAmount,
    }));

    showToast(
      lang === 'bn'
        ? `রেফারেল বোনাস +${referralAmount} Yuze Coins ক্লেইম হয়েছে!`
        : `Referral commission +${referralAmount} Coins claimed!`
    );
  };

  // Kombat Battles
  const handleWinBattle = (coinsWon: number) => {
    setUser((prev) => ({
      ...prev,
      yuzeCoins: prev.yuzeCoins + coinsWon,
      victories: prev.victories + 1,
      battles: prev.battles + 1,
      earned: prev.earned + coinsWon,
    }));
  };

  const handleLoseBattle = (coinsLost: number) => {
    setUser((prev) => ({
      ...prev,
      yuzeCoins: Math.max(0, prev.yuzeCoins - coinsLost),
      lost: prev.lost + coinsLost,
      battles: prev.battles + 1,
    }));
  };

  // Exchange Kombat coins to USDT
  const handleExchange = () => {
    if (user.kombatCoins < 1000) {
      showToast(lang === 'bn' ? 'এক্সচেঞ্জ করতে অন্তত ১,০০০ কয়েন লাগবে' : 'Minimum 1,000 coins required to exchange');
      return;
    }

    const exchangedUsdt = parseFloat((user.kombatCoins * 0.0005).toFixed(2));
    setUser((prev) => ({
      ...prev,
      kombatCoins: 0,
      usdtBalance: parseFloat((prev.usdtBalance + exchangedUsdt).toFixed(2)),
    }));

    showToast(
      lang === 'bn'
        ? `এক্সচেঞ্জ সফল! +$${exchangedUsdt} USDT যুক্ত হয়েছে।`
        : `Exchange successful! +$${exchangedUsdt} USDT added to wallet.`
    );
  };

  // Request Withdrawal
  const handleRequestWithdrawal = (
    amount: number,
    method: WithdrawalMethod,
    targetAddress: string
  ): { success: boolean; message: string } => {
    if (amount > user.usdtBalance) {
      return { success: false, message: 'Insufficient balance' };
    }

    const newRequest: WithdrawalRequest = {
      id: `wdr_${Date.now()}`,
      userId: user.id,
      username: user.username,
      amount,
      method,
      walletAddress: targetAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Deduct user balance
    setUser((prev) => ({
      ...prev,
      usdtBalance: parseFloat((prev.usdtBalance - amount).toFixed(4)),
    }));

    // Save to Firestore and local state
    submitWithdrawalToFirestore(newRequest);
    setWithdrawals((prev) => [newRequest, ...prev]);

    return {
      success: true,
      message:
        lang === 'bn'
          ? `উইথড্র আবেদন সফল হয়েছে! অ্যাডমিন অ্যাপ্রুভালের পর দ্রুত ব্যালেন্স পাঠানো হবে।`
          : `Withdrawal request submitted! Sent to admin approval queue.`,
    };
  };

  // Admin Actions
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    showToast('Admin settings updated successfully!');
  };

  const handleApproveWithdrawal = async (id: string, txHash?: string) => {
    await updateWithdrawalStatusInFirestore(id, 'approved', txHash);
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'approved', txHash } : w))
    );
    showToast('Withdrawal marked as Approved & Paid!');
  };

  const handleRejectWithdrawal = async (id: string, reason?: string) => {
    await updateWithdrawalStatusInFirestore(id, 'rejected', undefined, reason);
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'rejected', rejectionReason: reason } : w))
    );
    showToast('Withdrawal rejected.');
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setSettings(DEFAULT_SETTINGS);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setTasks(INITIAL_TASKS);
    showToast('Demo data reset to initial values.');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/50 text-white text-xs font-semibold shadow-[0_0_25px_rgba(168,85,247,0.5)] text-center animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Main Container - Responsive layout constrained to mobile width on small screens and centered with sleek backdrop */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative shadow-[0_0_80px_rgba(0,0,0,0.9)] bg-[#07090E]">
        {/* Top Header */}
        <Header
          user={user}
          lang={lang}
          onLanguageChange={setLang}
          onOpenAdmin={() => setAdminOpen(true)}
          onOpenSupport={() => setSupportOpen(true)}
        />

        {/* View Routing */}
        <main className="flex-1 mt-3">
          {activeTab === 'account' && (
            <div className="space-y-4 animate-fadeIn">
              <BalanceCards
                user={user}
                lang={lang}
                onOpenDeposit={() => setDepositOpen(true)}
                onOpenWithdraw={() => setWithdrawOpen(true)}
                onExchange={handleExchange}
              />

              {/* Quick Monetag Ad Action Card on Account Tab */}
              <div className="px-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#101428] to-indigo-950/60 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-lg">
                      📺
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Monetag Rewarded Ad</span>
                        <span className="text-[9px] bg-purple-600/40 text-purple-200 px-1.5 rounded">
                          10195941
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {lang === 'bn'
                          ? `আজ দেখেছেন: ${user.adsWatchedToday}/${settings.dailyAdLimit} টি`
                          : `Watched: ${user.adsWatchedToday}/${settings.dailyAdLimit} today`}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWatchAd}
                    disabled={cooldownRemaining > 0 || user.adsWatchedToday >= settings.dailyAdLimit}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {cooldownRemaining > 0
                      ? `${cooldownRemaining}s`
                      : lang === 'bn'
                      ? 'বিজ্ঞাপন দেখুন'
                      : 'Watch Ad'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earn' && (
            <EarnView
              user={user}
              settings={settings}
              tasks={tasks}
              lang={lang}
              onWatchAd={handleWatchAd}
              onClaimDaily={handleClaimDaily}
              onCompleteTask={handleCompleteTask}
              cooldownRemaining={cooldownRemaining}
            />
          )}

          {activeTab === 'kombat' && (
            <KombatView
              user={user}
              lang={lang}
              onWinBattle={handleWinBattle}
              onLoseBattle={handleLoseBattle}
            />
          )}

          {activeTab === 'leaders' && (
            <LeaderboardView
              leaderboard={leaderboard}
              userPoints={user.kombatCoins}
              userRank={user.rank}
              lang={lang}
            />
          )}

          {activeTab === 'friends' && (
            <FriendsView
              user={user}
              friends={friends}
              lang={lang}
              onClaimReferralEarnings={handleClaimReferralEarnings}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation
          currentTab={activeTab}
          onTabChange={setActiveTab}
          lang={lang}
        />
      </div>

      {/* MODALS */}
      <WalletModals
        user={user}
        settings={settings}
        withdrawals={withdrawals}
        lang={lang}
        depositOpen={depositOpen}
        withdrawOpen={withdrawOpen}
        onCloseDeposit={() => setDepositOpen(false)}
        onCloseWithdraw={() => setWithdrawOpen(false)}
        onRequestWithdrawal={handleRequestWithdrawal}
      />

      <AdPlayerModal
        isOpen={adPlayerOpen}
        zoneId={settings.monetagZoneId}
        rewardCoins={settings.rewardPerAd}
        usdtReward={settings.usdtEquivalentPerAd}
        lang={lang}
        onClose={() => setAdPlayerOpen(false)}
        onRewardEarned={handleAdRewardSuccess}
      />

      <AdminPanelModal
        isOpen={adminOpen}
        settings={settings}
        withdrawals={withdrawals}
        user={user}
        lang={lang}
        onClose={() => setAdminOpen(false)}
        onSaveSettings={handleSaveSettings}
        onApproveWithdrawal={handleApproveWithdrawal}
        onRejectWithdrawal={handleRejectWithdrawal}
        onResetDemoData={handleResetDemoData}
      />

      <SupportModal
        isOpen={supportOpen}
        lang={lang}
        onClose={() => setSupportOpen(false)}
      />
    </div>
  );
}
