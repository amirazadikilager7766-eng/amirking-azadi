import React, { useState } from 'react';
import { PlayerStats } from '../types';
import confetti from 'canvas-confetti';

interface Level2Props {
  onComplete: (stats: PlayerStats, historyLog: string) => void;
  currentStats: PlayerStats;
}

const BATTLE_QUESTIONS = [
    {
        q: "رقیب شما قیمت‌ها را ۲۰٪ کاهش داده است. واکنش استراتژیک؟",
        options: [
            { text: "من هم قیمت را پایین می‌آورم (جنگ قیمت)", damage: 0, selfDamage: 20 },
            { text: "ارزش افزوده‌ای اضافه می‌کنم (VIP Service)", damage: 25, selfDamage: 0 },
            { text: "شکایت از صنف", damage: 5, selfDamage: 10 }
        ]
    },
    {
        q: "الگوریتم اینستاگرام تغییر کرده و بازدیدت نصف شده. حرکت بعدی؟",
        options: [
            { text: "ناامیدی و کاهش فعالیت", damage: 0, selfDamage: 25 },
            { text: "تغییر فرمت محتوا به Reels تعاملی", damage: 30, selfDamage: 0 },
            { text: "خرید فالوور فیک", damage: 0, selfDamage: 40 }
        ]
    },
    {
        q: "یک مشتری ناراضی در کامنت‌ها بدترین توهین را کرده است.",
        options: [
            { text: "بلاک و حذف کامنت", damage: 10, selfDamage: 5 },
            { text: "پاسخ محترمانه و دعوت به دایرکت", damage: 30, selfDamage: 0 },
            { text: "دعوا در کامنت‌ها", damage: 0, selfDamage: 30 }
        ]
    },
    {
        q: "برای فروش ویژه یلدا کدام استراتژی بهتر است؟",
        options: [
            { text: "تخفیف ۵۰٪ روی همه چیز", damage: 15, selfDamage: 15 }, // Hurts profit margins
            { text: "ارائه پکیج هدیه + لید مگنت (شماره تماس)", damage: 35, selfDamage: 0 },
            { text: "هیچ کاری نکردن", damage: 0, selfDamage: 20 }
        ]
    },
    {
        q: "بودجه کمی داری. اولویت سرمایه‌گذاری؟",
        options: [
            { text: "تزئین دفتر کار", damage: 5, selfDamage: 10 },
            { text: "آموزش مهارت فروش و مذاکره", damage: 30, selfDamage: 0 },
            { text: "چاپ تراکت", damage: 10, selfDamage: 5 }
        ]
    }
];

const Level2Arena: React.FC<Level2Props> = ({ onComplete, currentStats }) => {
  const [index, setIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(currentStats.hp || 100);
  const [shake, setShake] = useState(false);
  const [attackAnim, setAttackAnim] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Powerups State
  const [usedShield, setUsedShield] = useState(false);

  const handleAction = (damage: number, selfDamage: number) => {
      // 1. Calculate Results
      let finalDamage = damage;
      let finalSelfDamage = selfDamage;

      // Powerup: Shield (Reduces self damage)
      if (usedShield && finalSelfDamage > 0) {
          finalSelfDamage = 0;
          setFeedback("سپر کوروش از شما محافظت کرد!");
          setUsedShield(false);
      } else {
          setFeedback(null);
      }

      // 2. Apply Effects
      if (finalSelfDamage > 0) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
      }
      if (finalDamage > 0) {
          setAttackAnim(true);
          setTimeout(() => setAttackAnim(false), 500);
          confetti({
             particleCount: 30,
             spread: 60,
             origin: { y: 0.7 },
             colors: ['#ef4444', '#f59e0b']
          });
      }

      // 3. Update Stats
      const newEnemyHp = Math.max(0, enemyHp - finalDamage);
      const newPlayerHp = Math.max(0, playerHp - finalSelfDamage);

      setEnemyHp(newEnemyHp);
      setPlayerHp(newPlayerHp);

      // 4. Progress Logic
      setTimeout(() => {
          if (newPlayerHp <= 0) {
              // Game Over / Restart Level Logic (Simplified: Just continue with penalty)
              alert("شکست خوردی! اما کوروش به تو فرصت دوباره می‌دهد...");
              setPlayerHp(50);
          } else if (index < BATTLE_QUESTIONS.length - 1 && newEnemyHp > 0) {
              setIndex(index + 1);
          } else {
              // Victory
              const bonusScore = playerHp * 2;
              onComplete({
                  ...currentStats,
                  quizScore: currentStats.quizScore + bonusScore,
                  hp: newPlayerHp,
                  gold: currentStats.gold + 500,
                  enemyHp: 0
              }, `Arena Victory. HP Left: ${newPlayerHp}`);
          }
      }, 1000);
  };

  const currentQ = BATTLE_QUESTIONS[index];

  return (
    <div className={`flex flex-col items-center justify-center min-h-[90vh] px-4 overflow-hidden relative ${shake ? 'shake' : ''}`}>
        
        {/* ATMOSPHERIC LAYER: EMBERS */}
        {Array.from({ length: 15 }).map((_, i) => (
             <div key={i} className="ember" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${2 + Math.random() * 3}s` }}></div>
        ))}

        {/* Battle Scene */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8 relative z-10">
            
            {/* Player Side */}
            <div className={`transition-all duration-300 ${playerHp < 30 ? 'pulse-red rounded-3xl p-4' : ''}`}>
                 <div className="bg-slate-900/80 p-6 rounded-3xl border-2 border-cyan-500/50 relative">
                     <span className="absolute -top-3 left-6 bg-cyan-700 text-xs px-2 py-1 rounded">شما</span>
                     <h2 className="text-xl font-bold text-white mb-4">{currentStats.title}</h2>
                     {feedback && <div className="text-green-400 text-sm animate-bounce mb-2">{feedback}</div>}
                     
                     {/* Powerups Bar */}
                     <div className="flex gap-2 mt-4">
                         <button 
                            onClick={() => setUsedShield(true)}
                            disabled={usedShield}
                            className={`flex-1 py-2 text-xs font-bold rounded border ${usedShield ? 'bg-gray-700 text-gray-500 border-gray-600' : 'bg-yellow-900/50 text-yellow-500 border-yellow-500 hover:bg-yellow-800'}`}
                         >
                            🛡️ سپر کوروش
                         </button>
                         <button className="flex-1 py-2 text-xs font-bold rounded border bg-red-900/50 text-red-500 border-red-500 hover:bg-red-800 opacity-50 cursor-not-allowed" title="فعلا غیرفعال">
                            🔥 آتش یلدا
                         </button>
                     </div>
                 </div>
            </div>

            {/* Enemy Side */}
            <div className="relative flex flex-col items-center">
                 <div className={`w-40 h-40 md:w-56 md:h-56 transition-transform duration-200 ${attackAnim ? 'scale-90 brightness-200' : 'animate-float'}`}>
                     {/* Dynamic SVG Monster based on Sohan image colors/style */}
                     <div className="w-full h-full rounded-full bg-gradient-to-br from-red-900 via-black to-yellow-900 border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.6)] flex items-center justify-center overflow-hidden relative">
                         <img src="https://ajiledalat.com/blog/wp-content/uploads/2025/12/%D8%B7%D8%B1%D8%B2-%D8%AA%D9%87%DB%8C%D9%87-%D8%B3%D9%88%D9%87%D8%A7%D9%86-%D8%B9%D8%B3%D9%84%DB%8C-2025-12-06T110732.695.webp" className="opacity-30 absolute inset-0 w-full h-full object-cover mix-blend-overlay" alt="Texture"/>
                         <span className="text-6xl z-10">👹</span>
                     </div>
                 </div>
                 <h2 className="text-2xl font-grunge text-red-500 mt-4 drop-shadow-lg">هیولای رکود</h2>
                 {attackAnim && <div className="absolute top-10 right-10 text-4xl font-bold text-yellow-400 animate-bounce">-30</div>}
            </div>

        </div>

        {/* Action Panel */}
        <div className="w-full max-w-4xl bg-black/90 border-t-4 border-yellow-600 rounded-t-3xl p-6 md:p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-20">
            <h3 className="text-xl md:text-2xl text-white mb-6 font-bold text-center">{currentQ.q}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQ.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleAction(opt.damage, opt.selfDamage)}
                        className="bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-600 active:border-b-0 active:translate-y-1 p-4 rounded-xl text-sm md:text-base font-bold transition-all text-right group"
                    >
                        <span className="block text-xs text-slate-500 mb-1">گزینه {i + 1}</span>
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Level2Arena;