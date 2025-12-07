import React, { useState, useEffect } from 'react';
import { PlayerStats } from '../types';

interface Level1Props {
  onComplete: (stats: PlayerStats, historyLog: string) => void;
  currentStats: PlayerStats;
}

const ANALYSIS_QUESTIONS = [
    { text: "آیا در حال حاضر وب‌سایت دارید؟", score: 10, type: "tech" },
    { text: "آیا پیج اینستاگرام فعال با تولید محتوا دارید؟", score: 10, type: "social" },
    { text: "میزان درآمد ماهیانه شما از کسب‌وکارتان راضی کننده است؟", score: 5, type: "finance" },
    { text: "آیا لیست مشتریان (Lead) خود را جایی ذخیره می‌کنید؟", score: 15, type: "marketing" },
    { text: "آیا برای تبلیغات هزینه ماهانه مشخصی دارید؟", score: 10, type: "marketing" },
    { text: "آیا با مفاهیم قیف فروش (Sales Funnel) آشنا هستید؟", score: 15, type: "skill" },
    { text: "آیا ترس از شکست مانع شروع کارهای جدیدتان می‌شود؟", score: 5, type: "mindset" }, 
    { text: "آیا روزانه حداقل ۱ ساعت آموزش تخصصی می‌بینید؟", score: 10, type: "growth" },
    { text: "آیا تیم یا همکار دارید یا تنها کار می‌کنید؟", score: 5, type: "scale" },
    { text: "آیا محصول یا خدمات شما قابلیت فروش آنلاین دارد؟", score: 5, type: "product" },
    { text: "آیا از هوش مصنوعی در کسب‌وکارتان استفاده می‌کنید؟", score: 15, type: "tech" },
    { text: "آیا برند شخصی (Personal Brand) دارید؟", score: 10, type: "brand" },
    { text: "آیا مشتریان قدیمی دوباره از شما خرید می‌کنند؟", score: 10, type: "retention" },
    { text: "آیا قیمت‌گذاری شما بر اساس ارزش است یا هزینه؟", score: 5, type: "finance" },
    { text: "آیا استراتژی محتوایی مکتوب دارید؟", score: 10, type: "content" },
    { text: "آیا مهارت متقاعدسازی و فروش تلفنی دارید؟", score: 10, type: "sales" },
    { text: "آیا کسب‌وکارتان بدون حضور شما هم درآمد دارد؟", score: 15, type: "system" },
    { text: "آیا اهداف مالی ۳ ماه آینده خود را نوشته‌اید؟", score: 5, type: "mindset" },
    { text: "آیا شبکه ارتباطی قدرتمندی دارید؟", score: 5, type: "network" },
    { text: "آیا آماده‌اید امشب مسیر زندگی‌تان را تغییر دهید؟", score: 20, type: "commitment" },
];

const Level1Desert: React.FC<Level1Props> = ({ onComplete, currentStats }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds per question
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [index]);

  const handleAnswer = (yes: boolean) => {
    const q = ANALYSIS_QUESTIONS[index];
    let points = 0;
    
    // Logic: If 'yes' gives points usually, except for negative questions
    let isPositive = yes;
    if (q.text.includes("ترس از شکست")) {
        isPositive = !yes;
    }
    
    if (isPositive) {
        // Combo Logic: Faster answer = Higher Combo chance
        // Actually, just correct/positive answer builds combo here
        const timeBonus = timeLeft > 5 ? 1.5 : 1; // 50% bonus for fast answer
        points = Math.floor(q.score * (1 + (combo * 0.1)) * timeBonus); // 10% bonus per combo level
        setCombo(prev => {
            const newCombo = prev + 1;
            if (newCombo > maxCombo) setMaxCombo(newCombo);
            return newCombo;
        });
    } else {
        points = 0;
        setCombo(0); // Reset combo
    }

    const newScore = score + points;
    setScore(newScore);
    const newAnswers = [...answers, yes];
    setAnswers(newAnswers);

    // Next Question
    if (index < ANALYSIS_QUESTIONS.length - 1) {
        setIndex(index + 1);
        setTimeLeft(10); // Reset timer
    } else {
        // Finished
        const finalStats = {
            ...currentStats,
            quizScore: newScore,
            gold: newScore * 10, 
            comboMultiplier: 1, // Reset for next level
            maxCombo: maxCombo,
            analysis: {
                hasBusiness: newAnswers[0], 
                mainProblem: newScore < 200 ? "ضعف در زیرساخت" : "چالش مقیاس‌پذیری",
                goal: "Improvement",
                score: newScore
            }
        };
        onComplete(finalStats, `Level 1 Analysis Score: ${newScore}. Max Combo: ${maxCombo}`);
    }
  };

  const progress = ((index + 1) / ANALYSIS_QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative">
      {/* ATMOSPHERIC LAYER: SANDSTORM */}
      <div className="sandstorm"></div>

      <div className="w-full max-w-3xl bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl border-2 border-yellow-600/50 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden z-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4">
             <div>
                <h2 className="text-3xl text-yellow-500 font-grunge mb-2">آنالیز عمیق کسب‌وکار</h2>
                <div className="text-sm text-slate-400">سوال {index + 1} از {ANALYSIS_QUESTIONS.length}</div>
             </div>
             {/* Timer */}
             <div className="flex flex-col items-center">
                 <span className={`text-2xl font-bold font-mono ${timeLeft < 4 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                 </span>
                 <span className="text-[10px] text-slate-500">زمان باقی‌مانده</span>
             </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
             <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question */}
        <div className="min-h-[120px] flex items-center justify-center mb-8 relative">
            <h3 className="text-2xl md:text-3xl text-white font-bold text-center leading-relaxed z-10">
                {ANALYSIS_QUESTIONS[index].text}
            </h3>
            {combo > 1 && (
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 rotate-12 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-bounce">
                    {combo}x COMBO! 🔥
                </div>
            )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-6">
            <button 
                onClick={() => handleAnswer(true)}
                className="bg-gradient-to-t from-green-900 to-green-800 hover:from-green-800 hover:to-green-700 border-b-4 border-green-600 active:border-b-0 active:translate-y-1 text-white py-4 rounded-xl text-xl font-bold transition-all shadow-lg shadow-green-900/40"
            >
                بله ✔️
            </button>
            <button 
                onClick={() => handleAnswer(false)}
                className="bg-gradient-to-t from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 border-b-4 border-red-600 active:border-b-0 active:translate-y-1 text-white py-4 rounded-xl text-xl font-bold transition-all shadow-lg shadow-red-900/40"
            >
                خیر ✖️
            </button>
        </div>

      </div>
    </div>
  );
};

export default Level1Desert;