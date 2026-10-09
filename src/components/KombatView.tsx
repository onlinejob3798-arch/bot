import React, { useState } from 'react';
import { Swords, Trophy, Zap, Shield, Sparkles, RefreshCw } from 'lucide-react';
import type { UserProfile, Language } from '../types';

interface KombatViewProps {
  user: UserProfile;
  lang: Language;
  onWinBattle: (coinsWon: number) => void;
  onLoseBattle: (coinsLost: number) => void;
}

type Move = 'rock' | 'paper' | 'scissors';

const MOVES: { id: Move; nameEn: string; nameBn: string; icon: string }[] = [
  { id: 'rock', nameEn: 'Rock (Fist)', nameBn: 'রক (পাথর)', icon: '✊' },
  { id: 'paper', nameEn: 'Paper', nameBn: 'পেপার (কাগজ)', icon: '✋' },
  { id: 'scissors', nameEn: 'Scissors', nameBn: 'সিজার (কাঁচি)', icon: '✌️' },
];

export const KombatView: React.FC<KombatViewProps> = ({
  user,
  lang,
  onWinBattle,
  onLoseBattle,
}) => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [botMove, setBotMove] = useState<Move | null>(null);
  const [battleState, setBattleState] = useState<'idle' | 'fighting' | 'result'>('idle');
  const [resultText, setResultText] = useState<{ status: 'win' | 'lose' | 'draw'; message: string }>({
    status: 'win',
    message: '',
  });

  const wagerAmount = 50;

  const handleFight = (playerMove: Move) => {
    setSelectedMove(playerMove);
    setBattleState('fighting');
    setBotMove(null);

    setTimeout(() => {
      const choices: Move[] = ['rock', 'paper', 'scissors'];
      const botPick = choices[Math.floor(Math.random() * choices.length)];
      setBotMove(botPick);

      if (playerMove === botPick) {
        setResultText({
          status: 'draw',
          message: lang === 'bn' ? 'ড্র হয়েছে! কোনো কয়েন হারাননি।' : "It's a Draw! Fair match.",
        });
      } else if (
        (playerMove === 'rock' && botPick === 'scissors') ||
        (playerMove === 'paper' && botPick === 'rock') ||
        (playerMove === 'scissors' && botPick === 'paper')
      ) {
        const winReward = 100;
        setResultText({
          status: 'win',
          message:
            lang === 'bn'
              ? `অভিনন্দন! আপনি জিতেছেন এবং +${winReward} কয়েন পেয়েছেন!`
              : `Victory! You won +${winReward} Yuze Coins!`,
        });
        onWinBattle(winReward);
      } else {
        setResultText({
          status: 'lose',
          message:
            lang === 'bn'
              ? `হেরে গেছেন! পরবর্তী রাউন্ডে আবার চেষ্টা করুন।`
              : `Defeat! Train harder for the next duel.`,
        });
        onLoseBattle(wagerAmount);
      }

      setBattleState('result');
    }, 1200);
  };

  const resetMatch = () => {
    setSelectedMove(null);
    setBotMove(null);
    setBattleState('idle');
  };

  return (
    <div className="space-y-4 px-4 pb-24 animate-fadeIn">
      {/* Kombat Arena Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0e1424] border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
        <div className="h-44 w-full relative">
          <img
            src="/src/assets/images/kombat_versus_1791554062166.jpg"
            alt="Yuzefa Kombat Arena"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-black/30" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-black/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                PVP Arena Mode
              </span>
              <h2 className="text-lg font-extrabold text-white tracking-tight mt-1">
                {lang === 'bn' ? 'ইউজেফা কমব্যাট এরিনা' : 'Welcome to Yuzefa Kombat'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Entry Prize</span>
              <div className="text-xs font-bold text-amber-300 font-mono-nums">
                +100 Coins
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pt-1 text-xs text-slate-300">
          <p className="leading-relaxed text-slate-400">
            {lang === 'bn'
              ? 'টেলিগ্রাম কমিউনিটির ক্লাসিক রক-পেপার-সিজারস কমব্যাট খেলুন এবং প্রতি জয়ে কয়েন অর্জন করুন।'
              : 'Join the classic rock-paper-scissors duel for the Telegram community. Compete for points, increase your victories, and earn Yuze tokens!'}
          </p>
        </div>
      </div>

      {/* Battle Matchup Visual Area */}
      <div className="rounded-3xl bg-[#090d18] border border-purple-900/40 p-4 shadow-inner">
        {battleState === 'idle' && (
          <div className="text-center py-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'bn' ? 'আপনার চাল নির্বাচন করুন:' : 'Choose Your Move:'}
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {MOVES.map((move) => (
                <button
                  key={move.id}
                  type="button"
                  onClick={() => handleFight(move.id)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-b from-[#131b31] to-[#0c1120] border border-purple-800/40 hover:border-purple-500 text-white shadow-md hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer active:scale-95 group"
                >
                  <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                    {move.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200">
                    {lang === 'bn' ? move.nameBn : move.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {battleState === 'fighting' && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center animate-bounce">
                <div className="w-16 h-16 rounded-2xl bg-purple-950/70 border border-purple-500/50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  {MOVES.find((m) => m.id === selectedMove)?.icon}
                </div>
                <div className="text-xs text-purple-300 font-bold mt-2">You</div>
              </div>

              <div className="text-xl font-extrabold text-cyan-400 animate-pulse">VS</div>

              <div className="text-center animate-bounce delay-100">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950/70 border border-cyan-500/50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  ❓
                </div>
                <div className="text-xs text-cyan-300 font-bold mt-2">Bot</div>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-400 animate-pulse">
              {lang === 'bn' ? 'লড়াই চলছে... ফলাফল গণনা হচ্ছে' : 'Battle in progress... Calculating outcome'}
            </p>
          </div>
        )}

        {battleState === 'result' && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-6 mb-3">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500 flex items-center justify-center text-3xl">
                  {MOVES.find((m) => m.id === selectedMove)?.icon}
                </div>
                <div className="text-[11px] text-purple-300 font-bold mt-1">You</div>
              </div>

              <div className="text-base font-extrabold text-slate-400">VS</div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-cyan-500 flex items-center justify-center text-3xl">
                  {MOVES.find((m) => m.id === botMove)?.icon}
                </div>
                <div className="text-[11px] text-cyan-300 font-bold mt-1">Opponent</div>
              </div>
            </div>

            <div
              className={`text-sm font-bold p-2.5 rounded-xl mb-3 ${
                resultText.status === 'win'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                  : resultText.status === 'lose'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {resultText.message}
            </div>

            <button
              type="button"
              onClick={resetMatch}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আবার খেলুন' : 'Battle Again'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Record Stats Summary */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-[#0e1424] border border-slate-800">
          <div className="text-[10px] text-slate-400">Total Battles</div>
          <div className="font-mono-nums font-bold text-white text-sm mt-0.5">{user.battles}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0e1424] border border-slate-800">
          <div className="text-[10px] text-slate-400">Victories</div>
          <div className="font-mono-nums font-bold text-emerald-400 text-sm mt-0.5">{user.victories}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0e1424] border border-slate-800">
          <div className="text-[10px] text-slate-400">Total Earned</div>
          <div className="font-mono-nums font-bold text-amber-300 text-sm mt-0.5">{user.earned.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
