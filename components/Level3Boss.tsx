import React, { useState, useEffect } from 'react';
import { PlayerStats } from '../types';

interface Level3Props {
  onComplete: (stats: PlayerStats, historyLog: string) => void;
  currentStats: PlayerStats;
}

// Larger pool of questions to randomly select from
const QUESTION_POOL = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop", // Strategy/Meeting
        q: "در این جلسه کاری، بزرگترین اشتباه مدیر چیست؟",
        options: [
            { text: "عدم توجه به زبان بدن کارمندان (نارضایتی پنهان)", score: 20 },
            { text: "استفاده از لپ‌تاپ", score: 0 },
            { text: "پوشیدن لباس غیررسمی", score: 0 }
        ]
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop", // Handshake/Deal
        q: "مهم‌ترین عامل در بسته شدن این قرارداد چیست؟",
        options: [
            { text: "سرعت عمل", score: 0 },
            { text: "ایجاد حس اعتماد و ارتباط چشمی موثر", score: 20 },
            { text: "قیمت پایین محصول", score: 0 }
        ]
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1526304640152-d4619684e884?q=80&w=1000&auto=format&fit=crop", // Stress/Failure
        q: "این فرد دچار فرسودگی شغلی است. راه حل مدیریتی؟",
        options: [
            { text: "افزایش حقوق", score: 5 },
            { text: "اخراج و استخدام نیروی تازه", score: 0 },
            { text: "تفویض اختیار و سیستم‌سازی", score: 20 }
        ]
    },
    {
        id: 4,
        image: "https://ajiledalat.com/blog/wp-content/uploads/2025/12/%D8%B7%D8%B1%D8%B2-%D8%AA%D9%87%DB%8C%D9%87-%D8%B3%D9%88%D9%87%D8%A7%D9%86-%D8%B9%D8%B3%D9%84%DB%8C-2025-12-06T110732.695.webp", // Product
        q: "برای فروش ۱۰ برابری این محصول در یلدا چه باید کرد؟",
        options: [
            { text: "فقط تبلیغات انبوه", score: 5 },
            { text: "داستان‌سرایی (Storytelling) حول محور دورهمی و خاطره", score: 20 },
            { text: "کاهش کیفیت برای سود بیشتر", score: -10 }
        ]
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop", // Analytics/Graph
        q: "نمودار فروش نزولی است. اولین اقدام؟",
        options: [
            { text: "بررسی قیف فروش (Funnel) و نرخ تبدیل", score: 20 },
            { text: "تغییر لوگوی شرکت", score: 0 },
            { text: "جلسه انگیزشی", score: 5 }
        ]
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop", // Technology/AI
        q: "رقبا از هوش مصنوعی استفاده می‌کنند. واکنش شما؟",
        options: [
            { text: "مقاومت و حفظ روش‌های سنتی", score: -10 },
            { text: "یادگیری و ادغام ابزارهای AI در فرآیندها", score: 20 },
            { text: "شکایت از تکنولوژی", score: 0 }
        ]
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop", // Remote Team
        q: "چالش اصلی مدیریت این تیم چیست؟",
        options: [
            { text: "هزینه اینترنت", score: 0 },
            { text: "حفظ فرهنگ سازمانی و ارتباطات موثر", score: 20 },
            { text: "ساعت کاری", score: 5 }
        ]
    }
];

const Level3Boss: React.FC<Level3Props> = ({ onComplete, currentStats }) => {
  const [questions, setQuestions] = useState<typeof QUESTION_POOL>([]);
  const [index, setIndex] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Randomly select 3 questions on mount
    const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 3));
    setIsLoaded(true);
  }, []);

  const handleChoice = (score: number) => {
      const newRoundScore = roundScore + score;
      setRoundScore(newRoundScore);

      if (index < questions.length - 1) {
          setIndex(index + 1);
      } else {
          // Finish Level 3
          const totalScore = currentStats.quizScore + newRoundScore;
          
          let title = "کارآموز";
          if(totalScore > 150) title = "تاجر کهکشانی";
          if(totalScore > 300) title = "اسطوره بازار";

          // MODIFIED: GO TO LEVEL 4 INSTEAD OF RESULT
          onComplete({
              ...currentStats,
              quizScore: totalScore,
              title: title,
              gold: currentStats.gold + (newRoundScore * 10)
          }, `Level 3 Visual Score: ${newRoundScore}. Total: ${totalScore}`);
      }
  };

  if (!isLoaded || questions.length === 0) return <div>Loading Puzzles...</div>;

  const currentP = questions[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-10 relative overflow-hidden">
        
        {/* ATMOSPHERIC LAYER: SNOW */}
        {Array.from({ length: 50 }).map((_, i) => (
             <div key={i} className="snow" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 5}s` }}></div>
        ))}

        <h2 className="text-4xl text-purple-400 font-grunge mb-8 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10">
            آزمون بینش بصری (مرحله ۳ از ۴)
        </h2>
        
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl border border-purple-500/30 shadow-2xl z-10">
            
            {/* Image Section */}
            <div className="relative h-64 md:h-[400px] rounded-2xl overflow-hidden border-2 border-yellow-500/50 group">
                <img 
                    src={currentP.image} 
                    alt="Business Puzzle" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded text-xs text-slate-300">
                    تصویر {index + 1} از {questions.length}
                </div>
            </div>

            {/* Question Section */}
            <div className="flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold mb-8 text-purple-100 leading-relaxed border-r-4 border-purple-500 pr-4">
                    {currentP.q}
                </h3>
                
                <div className="space-y-4">
                    {currentP.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleChoice(opt.score)}
                            className="w-full relative overflow-hidden bg-slate-800 hover:bg-purple-900/40 border border-slate-700 hover:border-purple-500 p-5 rounded-xl text-right transition-all group active:scale-95"
                        >
                            <span className="relative z-10 font-bold text-slate-200 group-hover:text-white transition-colors">
                                {opt.text}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-center gap-2">
                    {questions.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-purple-500' : 'w-2 bg-slate-700'}`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Level3Boss;