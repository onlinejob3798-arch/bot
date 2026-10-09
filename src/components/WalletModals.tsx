import React, { useState } from 'react';
import { X, Copy, Check, ArrowDownLeft, ArrowUpRight, Clock, AlertCircle, ExternalLink, QrCode } from 'lucide-react';
import type { UserProfile, AppSettings, WithdrawalRequest, WithdrawalMethod, Language } from '../types';

interface WalletModalsProps {
  user: UserProfile;
  settings: AppSettings;
  withdrawals: WithdrawalRequest[];
  lang: Language;
  depositOpen: boolean;
  withdrawOpen: boolean;
  onCloseDeposit: () => void;
  onCloseWithdraw: () => void;
  onRequestWithdrawal: (
    amount: number,
    method: WithdrawalMethod,
    walletAddress: string
  ) => { success: boolean; message: string };
}

export const WalletModals: React.FC<WalletModalsProps> = ({
  user,
  settings,
  withdrawals,
  lang,
  depositOpen,
  withdrawOpen,
  onCloseDeposit,
  onCloseWithdraw,
  onRequestWithdrawal,
}) => {
  // Deposit state
  const [depositNetwork, setDepositNetwork] = useState<'TRC20' | 'TON' | 'BEP20'>('TRC20');
  const [depositCopied, setDepositCopied] = useState(false);

  // Withdraw state
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawalMethod>('USDT (TRC20)');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('2.50');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');

  const getDepositAddress = () => {
    switch (depositNetwork) {
      case 'TRC20':
        return settings.depositWalletTrx;
      case 'TON':
        return settings.depositWalletTon;
      case 'BEP20':
        return settings.depositWalletBsc;
    }
  };

  const copyDepositAddress = () => {
    navigator.clipboard.writeText(getDepositAddress());
    setDepositCopied(true);
    setTimeout(() => setDepositCopied(false), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(null);

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError(lang === 'bn' ? 'সঠিক পরিমাণ দিন' : 'Please enter a valid amount');
      return;
    }

    if (amountNum < settings.minWithdrawalUsdt) {
      setWithdrawError(
        lang === 'bn'
          ? `সর্বনিম্ন উইথড্রয়াল $${settings.minWithdrawalUsdt.toFixed(2)} USDT`
          : `Minimum withdrawal is $${settings.minWithdrawalUsdt.toFixed(2)} USDT`
      );
      return;
    }

    if (amountNum > user.usdtBalance) {
      setWithdrawError(
        lang === 'bn'
          ? 'অপর্যাপ্ত ব্যালেন্স! আপনার ওয়ালেটে পর্যাপ্ত USDT নেই।'
          : 'Insufficient balance! You do not have enough USDT.'
      );
      return;
    }

    if (!walletAddress.trim()) {
      setWithdrawError(
        lang === 'bn'
          ? 'উইথড্র করার ঠিকানা বা নম্বর লিখুন'
          : 'Please enter receiving address or account number'
      );
      return;
    }

    const res = onRequestWithdrawal(amountNum, withdrawMethod, walletAddress);
    if (res.success) {
      setWithdrawSuccess(res.message);
      setWalletAddress('');
      setTimeout(() => {
        setActiveTab('history');
      }, 1000);
    } else {
      setWithdrawError(res.message);
    }
  };

  return (
    <>
      {/* DEPOSIT MODAL (Matching "Top Up Your Balance with USDT" from reference) */}
      {depositOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0c101d] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-[0_-10px_40px_rgba(147,51,234,0.3)] animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-900/50 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'bn' ? 'ইউএসডিটি ডিপোজিট করুন' : 'Top Up Your Balance with USDT'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseDeposit}
                className="w-7 h-7 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Network Selector Tabs */}
            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                {lang === 'bn' ? 'নেটওয়ার্ক নির্বাচন করুন' : 'Select Network'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['TRC20', 'TON', 'BEP20'] as const).map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setDepositNetwork(net)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      depositNetwork === net
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400'
                        : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    USDT-{net}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated QR Code Visual */}
            <div className="mt-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-purple-900/40">
              <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                {/* SVG QR Code Mock */}
                <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-white">
                  <QrCode className="w-20 h-20 text-purple-400" />
                  <span className="text-[8px] font-mono mt-0.5 text-slate-300">
                    SCAN TO PAY
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-2">
                Deposit USDT ({depositNetwork}) only to this address
              </span>
            </div>

            {/* Deposit Address Box with Copy */}
            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                {lang === 'bn' ? 'ডিপোজিট এড্রেস' : 'Deposit Address'}
              </label>
              <div className="flex items-center gap-2 p-2 pl-3 rounded-2xl bg-black/60 border border-purple-900/40">
                <span className="text-xs text-purple-200 font-mono truncate flex-1 select-all">
                  {getDepositAddress()}
                </span>
                <button
                  type="button"
                  onClick={copyDepositAddress}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {depositCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Notice */}
            <div className="mt-4 p-3 rounded-xl bg-purple-950/30 border border-purple-900/30 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                Minimum deposit is 1.00 USDT. Deposits are credited automatically after 3 blockchain network confirmations.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {withdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0c101d] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-[0_-10px_40px_rgba(147,51,234,0.3)] animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'bn' ? 'টাকা তুলুন (Withdraw)' : 'Withdraw Balance'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseWithdraw}
                className="w-7 h-7 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub Tabs: Request vs History */}
            <div className="flex gap-2 mt-4 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('request')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'request'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'নতুন আবেদন' : 'Withdraw Request'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'হিস্ট্রি' : 'History'} ({withdrawals.length})
              </button>
            </div>

            {activeTab === 'request' ? (
              <form onSubmit={handleWithdrawSubmit} className="mt-4 space-y-3.5">
                {/* Available Balance Box */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-900/40 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Available to Withdraw:</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono-nums">
                    {user.usdtBalance.toFixed(2)} USDT
                  </span>
                </div>

                {/* Method selector */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                    {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Payment Method'}
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value as WithdrawalMethod)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="USDT (TRC20)">USDT (TRC20 Network)</option>
                    <option value="USDT (BEP20)">USDT (BEP20 / BNB Chain)</option>
                    <option value="TON">TON (The Open Network)</option>
                    <option value="bKash (Personal)">bKash (Personal Bangladesh)</option>
                    <option value="Nagad (Personal)">Nagad (Personal Bangladesh)</option>
                    <option value="Binance Pay">Binance Pay ID</option>
                  </select>
                </div>

                {/* Amount input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {lang === 'bn' ? 'পরিমাণ (USDT)' : 'Amount (USDT)'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(user.usdtBalance.toString())}
                      className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min={settings.minWithdrawalUsdt}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 2.50"
                      className="w-full py-2.5 pl-3 pr-16 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                      USDT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Min withdrawal: ${settings.minWithdrawalUsdt.toFixed(2)} USDT
                  </span>
                </div>

                {/* Receiving Address or Account Number */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                    {withdrawMethod.includes('bKash') || withdrawMethod.includes('Nagad')
                      ? lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'
                      : withdrawMethod.includes('Binance')
                      ? 'Binance Pay ID / Email'
                      : lang === 'bn' ? 'রিসিভিং ওয়ালেট এড্রেস' : 'Receiving Wallet Address'}
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder={
                      withdrawMethod.includes('bKash') || withdrawMethod.includes('Nagad')
                        ? '01XXXXXXXXX'
                        : withdrawMethod.includes('Binance')
                        ? 'Binance Pay ID'
                        : 'e.g. 0x... or T...'
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Messages */}
                {withdrawError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                    {withdrawError}
                  </div>
                )}
                {withdrawSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>{withdrawSuccess}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer active:scale-98"
                >
                  {lang === 'bn' ? 'উইথড্র নিশ্চিত করুন' : 'Confirm Withdrawal'}
                </button>
              </form>
            ) : (
              /* HISTORY VIEW */
              <div className="mt-4 space-y-2.5">
                {withdrawals.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No withdrawal requests yet.
                  </div>
                ) : (
                  withdrawals.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>${item.amount.toFixed(2)} USDT</span>
                          <span className="text-[10px] text-slate-400">via {item.method}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">
                          {item.walletAddress}
                        </div>
                        <div className="text-[9px] text-slate-600 mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : item.status === 'rejected'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.txHash && (
                          <div className="text-[9px] text-purple-400 font-mono mt-1">
                            Tx: {item.txHash.slice(0, 10)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
