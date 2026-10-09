import React from 'react';
import { X, MessageCircle, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import type { Language } from '../types';

interface SupportModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, lang, onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMsg('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#0c101d] border border-purple-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(147,51,234,0.3)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {lang === 'bn' ? 'সাপোর্ট এবং হেল্প' : 'YUZEFA Support Desk'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/30 text-slate-300">
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked'}</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Monetag Rewarded Ads: Zone 10195941</li>
              <li>• Withdrawal processing: 10 mins – 2 hrs</li>
              <li>• Supported: USDT TRC20, TON, bKash, Nagad</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {lang === 'bn' ? 'বার্তা পাঠান' : 'Send Support Ticket'}
            </label>
            <textarea
              rows={3}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={lang === 'bn' ? 'আপনার সমস্যার বিবরণ লিখুন...' : 'Describe your question or issue...'}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
            />

            {submitted ? (
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ticket Submitted!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সাবমিট করুন' : 'Submit Ticket'}</span>
              </button>
            )}
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <a
              href="https://t.me/telegram"
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 hover:text-purple-300 font-semibold text-[11px] inline-flex items-center gap-1"
            >
              <span>{lang === 'bn' ? 'টেলিগ্রাম গ্রুপে জয়েন করুন' : 'Join Official Telegram Community'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
