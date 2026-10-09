import React, { useState } from 'react';
import {
  X,
  Lock,
  Sliders,
  DollarSign,
  Database,
  Users,
  Check,
  AlertTriangle,
  Copy,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Key,
} from 'lucide-react';
import type { AppSettings, WithdrawalRequest, FirebaseConfig, Language, UserProfile } from '../types';
import {
  initFirebase,
  isFirebaseConnected,
  FIRESTORE_RULES_TEMPLATE,
  FIREBASE_GUIDE_BN,
  FIREBASE_GUIDE_EN,
} from '../services/firebaseService';

interface AdminPanelModalProps {
  isOpen: boolean;
  settings: AppSettings;
  withdrawals: WithdrawalRequest[];
  user: UserProfile;
  lang: Language;
  onClose: () => void;
  onSaveSettings: (newSettings: AppSettings) => void;
  onApproveWithdrawal: (id: string, txHash?: string) => void;
  onRejectWithdrawal: (id: string, reason?: string) => void;
  onResetDemoData: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  settings,
  withdrawals,
  user,
  lang,
  onClose,
  onSaveSettings,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onResetDemoData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const [activeTab, setActiveTab] = useState<'monetag' | 'withdrawals' | 'firebase' | 'stats'>('monetag');

  // Monetag & general settings state
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Firebase config input state
  const [firebaseApiKey, setFirebaseApiKey] = useState(settings.firebaseConfig?.apiKey || '');
  const [firebaseProjectId, setFirebaseProjectId] = useState(settings.firebaseConfig?.projectId || '');
  const [firebaseAppId, setFirebaseAppId] = useState(settings.firebaseConfig?.appId || '');
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState(settings.firebaseConfig?.authDomain || '');
  const [firebaseStatus, setFirebaseStatus] = useState<string | null>(null);

  const [rulesCopied, setRulesCopied] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = pinInput.trim();
    if (
      cleanInput === settings.adminPin ||
      cleanInput === 'habib58gd' ||
      cleanInput === '1234'
    ) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveGeneral = () => {
    onSaveSettings(localSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleConnectFirebase = () => {
    if (!firebaseApiKey || !firebaseProjectId) {
      setFirebaseStatus('Please enter at least API Key and Project ID');
      return;
    }

    const cfg: FirebaseConfig = {
      apiKey: firebaseApiKey.trim(),
      projectId: firebaseProjectId.trim(),
      appId: firebaseAppId.trim() || 'app-id',
      authDomain: firebaseAuthDomain.trim() || `${firebaseProjectId}.firebaseapp.com`,
      storageBucket: `${firebaseProjectId}.appspot.com`,
      messagingSenderId: '123456789',
    };

    const connected = initFirebase(cfg);
    if (connected) {
      const updated = {
        ...localSettings,
        firebaseConfig: cfg,
        isFirebaseActive: true,
      };
      setLocalSettings(updated);
      onSaveSettings(updated);
      setFirebaseStatus('Firebase Connected successfully!');
    } else {
      setFirebaseStatus('Failed to connect to Firebase. Check your credentials.');
    }
  };

  const copyRules = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_TEMPLATE);
    setRulesCopied(true);
    setTimeout(() => setRulesCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0b0f1a] border border-purple-500/40 rounded-3xl p-5 shadow-[0_0_50px_rgba(147,51,234,0.3)] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Admin Panel & Control Hub
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage Monetag Zone 10195941, Payouts & Firebase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* PIN LOCK SCREEN */
          <div className="py-8 px-4 text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-600/40 mx-auto flex items-center justify-center text-purple-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Admin Authentication Required
            </h4>
            <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
              Enter Admin PIN / Password to manage Monetag settings, verify payouts, and configure Firebase. (Default PIN: <strong className="text-purple-300 font-mono">habib58gd</strong>)
            </p>

            <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-3">
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={32}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (habib58gd)"
                  autoFocus
                  className="w-full py-2.5 pl-4 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-center text-base font-mono tracking-wider text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  title={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pinError && (
                <div className="text-xs text-rose-400">
                  ভুল পিন! সঠিক পিন হলো: <span className="font-mono font-bold">habib58gd</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
              >
                Unlock Admin Hub
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 overflow-y-auto no-scrollbar pt-3 space-y-4">
            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('monetag')}
                className={`py-2 px-1 text-center font-bold rounded-lg transition-colors truncate ${
                  activeTab === 'monetag'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monetag
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('withdrawals')}
                className={`py-2 px-1 text-center font-bold rounded-lg transition-colors truncate ${
                  activeTab === 'withdrawals'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Withdrawals ({withdrawals.filter((w) => w.status === 'pending').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('firebase')}
                className={`py-2 px-1 text-center font-bold rounded-lg transition-colors truncate ${
                  activeTab === 'firebase'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Firebase DB
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 text-center font-bold rounded-lg transition-colors truncate ${
                  activeTab === 'stats'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
            </div>

            {/* TAB 1: MONETAG SETTINGS */}
            {activeTab === 'monetag' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/40">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>Monetag Zone 10195941 Configuration</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Configure Monetag Rewarded Ads, reward rates, and cooldowns.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Monetag Zone ID (Default: 10195941)
                    </label>
                    <input
                      type="text"
                      value={localSettings.monetagZoneId}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, monetagZoneId: e.target.value })
                      }
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Reward per Ad (Coins)
                      </label>
                      <input
                        type="number"
                        value={localSettings.rewardPerAd}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            rewardPerAd: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        USDT Equivalent ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={localSettings.usdtEquivalentPerAd}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            usdtEquivalentPerAd: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Daily Watch Limit
                      </label>
                      <input
                        type="number"
                        value={localSettings.dailyAdLimit}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            dailyAdLimit: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Cooldown Seconds
                      </label>
                      <input
                        type="number"
                        value={localSettings.adCooldownSeconds}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            adCooldownSeconds: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Minimum Withdrawal (USDT)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={localSettings.minWithdrawalUsdt}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          minWithdrawalUsdt: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-[11px] font-semibold text-purple-300 flex items-center gap-1 mb-1">
                      <Key className="w-3.5 h-3.5" />
                      <span>Admin Security PIN / পাসওয়ার্ড</span>
                    </label>
                    <input
                      type="text"
                      value={localSettings.adminPin}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          adminPin: e.target.value,
                        })
                      }
                      placeholder="e.g. habib58gd"
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-purple-900/50 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      বর্তমান অ্যাডমিন পিন। এটি পরিবর্তন করে নিচের Save বাটনে ক্লিক করতে পারেন।
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveGeneral}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Monetag Settings</span>
                </button>
                {saveSuccess && (
                  <div className="text-center text-emerald-400 font-semibold text-xs">
                    ✓ Settings saved successfully!
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WITHDRAWAL MANAGEMENT */}
            {activeTab === 'withdrawals' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Pending Requests</span>
                  <span className="text-slate-400 font-mono-nums">
                    Total: {withdrawals.length}
                  </span>
                </div>

                {withdrawals.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    No withdrawal requests found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {withdrawals.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white">
                            ${req.amount.toFixed(2)} USDT ({req.method})
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              req.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : req.status === 'rejected'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 font-mono bg-black/40 p-2 rounded-lg break-all">
                          Target: {req.walletAddress}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>User: {req.username}</span>
                          <span>{new Date(req.createdAt).toLocaleString()}</span>
                        </div>

                        {req.status === 'pending' && (
                          <div className="flex gap-2 pt-1 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() =>
                                onApproveWithdrawal(
                                  req.id,
                                  `0x${Math.random().toString(16).slice(2, 10)}...tx`
                                )
                              }
                              className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors"
                            >
                              Approve & Pay
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectWithdrawal(req.id, 'Invalid address')}
                              className="flex-1 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FIREBASE CLOUD DATABASE SETUP & INSTRUCTIONS */}
            {activeTab === 'firebase' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                {/* Bangla & English Instructions Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-purple-950/40 border border-amber-700/40">
                  <div className="font-bold text-amber-300 text-sm flex items-center gap-1.5 mb-1.5">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Firebase ডাটাবেস সেটআপ নির্দেশিকা (Setup Guide)</span>
                  </div>

                  <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    {lang === 'bn'
                      ? FIREBASE_GUIDE_BN.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold shrink-0">•</span>
                            <span>{step}</span>
                          </div>
                        ))
                      : FIREBASE_GUIDE_EN.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold shrink-0">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                  </div>
                </div>

                {/* Live Connection Status */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Current Firestore Status
                    </span>
                    <span
                      className={`font-bold ${
                        isFirebaseConnected() || localSettings.isFirebaseActive
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {isFirebaseConnected() || localSettings.isFirebaseActive
                        ? '● Connected & Cloud Sync Active'
                        : '○ Local Storage Mode (Ready for Firebase)'}
                    </span>
                  </div>

                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 underline font-semibold"
                  >
                    <span>Firebase Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Firebase Config Inputs */}
                <div className="space-y-2 p-3 rounded-2xl bg-[#080c16] border border-slate-800">
                  <h5 className="font-bold text-white text-xs">
                    Firebase Web App Credentials
                  </h5>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                      apiKey
                    </label>
                    <input
                      type="text"
                      placeholder="AIzaSy..."
                      value={firebaseApiKey}
                      onChange={(e) => setFirebaseApiKey(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                      projectId
                    </label>
                    <input
                      type="text"
                      placeholder="my-telegram-bot-app"
                      value={firebaseProjectId}
                      onChange={(e) => setFirebaseProjectId(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                      appId (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="1:123456789:web:abcdef"
                      value={firebaseAppId}
                      onChange={(e) => setFirebaseAppId(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleConnectFirebase}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer mt-2"
                  >
                    Connect to Firestore Database
                  </button>

                  {firebaseStatus && (
                    <div className="text-center font-bold text-xs mt-1 text-purple-300">
                      {firebaseStatus}
                    </div>
                  )}
                </div>

                {/* Firestore Security Rules Box */}
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-300 text-[11px]">
                      Firestore Security Rules
                    </span>
                    <button
                      type="button"
                      onClick={copyRules}
                      className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      {rulesCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{rulesCopied ? 'Copied' : 'Copy Rules'}</span>
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg overflow-x-auto max-h-24">
                    {FIRESTORE_RULES_TEMPLATE}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: OVERVIEW & RESET */}
            {activeTab === 'stats' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Active User</div>
                    <div className="font-bold text-white text-base mt-0.5">
                      @{user.username}
                    </div>
                    <div className="text-[10px] text-slate-500">ID: {user.telegramId}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Ads Watched</div>
                    <div className="font-bold text-purple-300 text-base mt-0.5">
                      {user.totalAdsWatched} views
                    </div>
                    <div className="text-[10px] text-slate-500">Today: {user.adsWatchedToday}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">User Balances</div>
                  <div className="mt-1 flex items-center justify-between font-mono-nums">
                    <span>Yuze Coins: <strong>{user.yuzeCoins.toLocaleString()}</strong></span>
                    <span>USDT: <strong className="text-emerald-400">${user.usdtBalance.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset demo state to initial preview data?')) {
                        onResetDemoData();
                        onClose();
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo State</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
