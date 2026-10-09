export type Language = 'en' | 'bn';

export interface UserProfile {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  avatarUrl: string;
  yuzeCoins: number;
  kombatCoins: number;
  usdtBalance: number;
  league: string;
  rank: number;
  victories: number;
  battles: number;
  lost: number;
  earned: number;
  streakDays: number;
  lastDailyClaim: string | null;
  referralCode: string;
  referredBy: string | null;
  referralsCount: number;
  referralEarnings: number;
  adsWatchedToday: number;
  lastAdWatchedAt: number;
  totalAdsWatched: number;
  createdAt: string;
}

export type WithdrawalMethod =
  | 'USDT (TRC20)'
  | 'USDT (BEP20)'
  | 'TON'
  | 'bKash (Personal)'
  | 'Nagad (Personal)'
  | 'Binance Pay';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: WithdrawalMethod;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  txHash?: string;
  rejectionReason?: string;
}

export interface LeaderboardUser {
  place: number;
  nickname: string;
  points: number;
  badge?: string;
  isCurrentUser?: boolean;
  avatar?: string;
}

export interface ReferralFriend {
  id: string;
  name: string;
  username: string;
  joinedDate: string;
  earnedCoins: number;
  status: 'active' | 'pending';
}

export interface AppSettings {
  monetagZoneId: string;
  rewardPerAd: number; // in Yuze coins (e.g. 50)
  usdtEquivalentPerAd: number; // in USDT (e.g. 0.05)
  dailyAdLimit: number; // e.g. 25
  adCooldownSeconds: number; // e.g. 20
  minWithdrawalUsdt: number; // e.g. 2.00
  referralBonusCoins: number; // e.g. 500
  referralCommissionPercent: number; // e.g. 10
  depositWalletTrx: string;
  depositWalletTon: string;
  depositWalletBsc: string;
  adminPin: string;
  firebaseConfig: FirebaseConfig | null;
  isFirebaseActive: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface TaskItem {
  id: string;
  titleEn: string;
  titleBn: string;
  reward: number;
  type: 'telegram' | 'twitter' | 'referral' | 'ads' | 'daily';
  link?: string;
  completed: boolean;
  targetCount?: number;
  currentCount?: number;
}
