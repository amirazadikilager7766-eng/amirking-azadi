import React, { useEffect, useState, useRef } from 'react';
import { PlayerStats, LeaderboardEntry } from '../types';
import { generateStaticReport } from '../services/analysisEngine';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';

interface ResultProps {
  stats: PlayerStats;
  history: string[];
  onRestart: () => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: "آرش کریپتو", score: 3200, title: "اسطوره بازار" },
    { rank: 2, name: "سارا سئو", score: 2950, title: "تاجر کهکشانی" },
    { rank: 3, name: "علی آمازون", score: 2700, title: "تاجر کهکشانی" },
    { rank: 4, name: "مریم گرافیک", score: 2100, title: "استاد اعظم" },
    { rank: 5, name: "رضا بازار", score: 1850, title: "بازرگان" },
];

const ResultScreen: React.FC<ResultProps> = ({ stats, history, onRestart }) => {
  const [report, setReport] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'roadmap' | 'wheel' | 'leaderboard'>('wheel'); 
  
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

  // VIRAL CHEST STATE
  const [isChestLocked, setIsChestLocked] = useState(true);

  useEffect(() => {
    // Generate Instant Static Report
    const text = generateStaticReport(stats);
    setReport(text);

    // Update Leaderboard
    const playerEntry: LeaderboardEntry = {
        rank: 0,
        name: stats.name || "بازیکن",
        score: stats.quizScore,
        title: stats.title,
        isPlayer: true
    };
    
    const newBoard = [...MOCK_LEADERBOARD, playerEntry].sort((a, b) => b.score - a.score);
    newBoard.forEach((item, index) => item.rank = index + 1);
    setLeaderboard(newBoard);
    
    if (stats.quizScore > 1000) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
  }, []);

  const spinWheel = () => {
    if (spinning || prize) return;
    setSpinning(true);
    
    // Pro Prizes
    const prizes = [
        "مشاوره خصوصی (VIP)", 
        "دوره استراتژی فروش", 
        "۲۰٪ تخفیف خدمات", 
        "آنالیز ۳۶۰ درجه پیج",
        "کوچینگ ۱ ساعته",
        "چک‌لیست طلایی سیستم‌سازی"
    ];
    
    // Calculate random stop
    const spinDeg = 2000 + Math.random() * 1000; 
    
    if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        wheelRef.current.style.transform = `rotate(${spinDeg}deg)`;
    }

    setTimeout(() => {
        setSpinning(false);
        const result = prizes[Math.floor(Math.random() * prizes.length)];
        setPrize(result);
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 }, colors: ['#FFD700', '#FF0000'] });
    }, 6000);
  };

  const handleClaimPrize = () => {
      setShowVictoryModal(true);
  };

  const handleWhatsAppRedirect = () => {
      const message = `سلام! من ${stats.name} هستم.\nدر نبرد بیزینسی یلدا شرکت کردم.\n🏆 امتیاز: ${stats.quizScore}\n🔰 سطح: ${stats.title}\n🎁 جایزه برنده شده: ${prize}\n\nلطفا جایزه من را ارسال کنید!`;
      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/989101658002?text=${encodedMsg}`, '_blank');
  };

  const handleDownload = () => {
      const element = document.createElement("a");
      const file = new Blob([report], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Yalda_Report_${stats.name}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  };

  const handleInvite = () => {
      const inviteMsg = "بیا تو هم در نبرد بیزینسی یلدا ۲۰۷۷ شرکت کن و مسیر موفقیتت رو پیدا کن! 🍉🔥\nلینک: https://your-game-url.com";
      const url = `https://wa.me/?text=${encodeURIComponent(inviteMsg)}`;
      window.open(url, '_blank');
      
      // Unlock after "sharing"
      setTimeout(() => {
          setIsChestLocked(false);
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 }, colors: ['#FACC15'] });
      }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0505] text-white flex flex-col pt-24 pb-10 px-4 overflow-y-auto relative">
      
      {/* HEADER */}
      <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-grunge text-transparent bg-clip-text bg-gradient-to-t from-yellow-600 to-yellow-300 mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
              {stats.name}، قهرمان یلدا
          </h1>
          <div className="flex justify-center items-center gap-6 text-xl md:text-2xl mt-4">
             <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-yellow-600/30">
                 امتیاز: <span className="text-cyan-400 font-mono font-bold">{stats.quizScore.toLocaleString()}</span>
             </div>
             <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-red-600/30">
                 کمبو: <span className="text-red-500 font-mono font-bold">{stats.maxCombo}🔥</span>
             </div>
             {stats.voiceScore && (
                <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-purple-600/30">
                   انرژی صدا: <span className="text-purple-400 font-mono font-bold">{stats.voiceScore}%🎙️</span>
                </div>
             )}
          </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 z-10">
          {[
            { id: 'wheel', icon: '🎁', label: 'گردونه جوایز' },
            { id: 'roadmap', icon: '📜', label: 'نقشه راه' },
            { id: 'leaderboard', icon: '🏆', label: 'رتبه‌بندی' },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 md:px-8 py-3 rounded-full flex items-center gap-2 font-bold transition-all text-sm md:text-base font-grunge tracking-wide
                    ${activeTab === tab.id 
                        ? 'bg-gradient-to-r from-red-700 to-red-900 border-2 border-yellow-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-105' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-600'}
                `}
              >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
              </button>
          ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* === WHEEL OF FORTUNE (PRO VERSION) === */}
        {activeTab === 'wheel' && (
            <div className="flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 md:p-12 border-2 border-yellow-600/30 shadow-[0_0_60px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                
                <div className="relative z-20 mb-10 scale-90 md:scale-100">
                     <div className="w-8 h-12 bg-gradient-to-b from-white to-gray-300 absolute -top-4 left-1/2 -translate-x-1/2 z-30 shadow-xl clip-triangle border-2 border-gray-400"></div>
                     <div 
                        ref={wheelRef}
                        className="w-[320px] h-[320px] md:w-[450px] md:h-[450px] rounded-full border-[10px] border-yellow-600 shadow-[0_0_50px_rgba(234,179,8,0.3)] relative bg-slate-900 overflow-hidden"
                     >
                        <div className="absolute inset-0" style={{ 
                            background: `conic-gradient(#7f1d1d 0deg 60deg, #b45309 60deg 120deg, #7f1d1d 120deg 180deg, #b45309 180deg 240deg, #7f1d1d 240deg 300deg, #b45309 300deg 360deg)` 
                        }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-yellow-500 rounded-full border-4 border-yellow-200 shadow-lg flex items-center justify-center text-3xl animate-pulse">🍉</div>
                        </div>
                     </div>
                </div>

                {prize ? (
                    <div className="text-center z-20 animate-float">
                        <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 rounded-2xl border-2 border-green-500 shadow-2xl mb-6 transform hover:scale-105 transition-transform">
                            <h3 className="text-xl text-green-300 font-bold mb-2 uppercase tracking-widest">جایزه شما</h3>
                            <p className="text-white text-3xl font-bold font-grunge drop-shadow-lg">{prize}</p>
                        </div>
                        <button 
                            onClick={handleClaimPrize}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black text-xl font-bold px-10 py-4 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] animate-pulse hover:scale-105 transition-transform font-grunge"
                        >
                            دریافت نهایی جایزه 🎁
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={spinWheel}
                        disabled={spinning}
                        className={`relative z-20 px-12 py-5 rounded-full font-bold text-2xl shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all font-grunge
                            ${spinning ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:scale-110 hover:shadow-[0_0_60px_rgba(220,38,38,0.8)]'}
                        `}
                    >
                        {spinning ? 'درحال چرخش...' : 'چرخش گردونه شانس'}
                    </button>
                )}

                {/* --- VIRAL CHEST --- */}
                <div className="mt-12 w-full max-w-2xl bg-black/60 rounded-xl p-6 border border-yellow-500/30 flex flex-col items-center">
                    <h4 className="text-yellow-500 font-grunge text-2xl mb-4">صندوقچه طلایی یلدا</h4>
                    {isChestLocked ? (
                        <div className="text-center">
                            <div className="text-5xl mb-4 animate-bounce grayscale opacity-70">📦🔒</div>
                            <p className="text-slate-400 mb-4 text-sm">برای باز کردن این صندوقچه و دریافت <span className="text-yellow-400">یک انار جادویی اضافه</span>، بازی را با دوستانت به اشتراک بگذار!</p>
                            <button 
                                onClick={handleInvite}
                                className="bg-[#25D366] text-white px-6 py-2 rounded-full font-bold hover:bg-[#128C7E] transition-colors flex items-center gap-2 mx-auto"
                            >
                                🚀 دعوت از دوستان (واتساپ)
                            </button>
                        </div>
                    ) : (
                        <div className="text-center animate-modalZoom">
                            <div className="text-6xl mb-2 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]">💎</div>
                            <p className="text-yellow-300 font-bold text-lg">تبریک! صندوقچه باز شد.</p>
                            <p className="text-slate-300 text-sm">شما یک انار جادویی دریافت کردید که در پروفایل شما ذخیره شد.</p>
                        </div>
                    )}
                </div>

            </div>
        )}

        {/* === AI ROADMAP === */}
        {activeTab === 'roadmap' && (
            <div className="bg-slate-900/90 backdrop-blur-xl border-2 border-yellow-600/40 rounded-3xl p-6 md:p-10 shadow-2xl min-h-[400px]">
                <div className="flex justify-between items-center bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/30 mb-6 flex-wrap gap-4">
                    <h3 className="text-yellow-400 m-0 text-lg font-bold">تحلیل هوشمند کسب‌وکار</h3>
                    <button 
                        onClick={handleDownload}
                        className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <span>📥</span>
                        <span>دانلود فایل گزارش</span>
                    </button>
                </div>
                <div className="prose prose-invert prose-yellow prose-lg max-w-none text-right font-vazir leading-loose" dir="rtl">
                    <ReactMarkdown>{report}</ReactMarkdown>
                </div>
            </div>
        )}

        {/* === LEADERBOARD === */}
        {activeTab === 'leaderboard' && (
            <div className="bg-slate-900/90 rounded-3xl overflow-hidden border border-yellow-700/30 shadow-2xl">
                <div className="p-6 bg-gradient-to-r from-red-900 to-slate-900 text-center border-b border-yellow-700/30">
                    <h3 className="text-2xl font-bold text-yellow-400 font-grunge">برترین‌های نبرد یلدا</h3>
                </div>
                <div className="divide-y divide-slate-800">
                    {leaderboard.map((entry) => (
                        <div 
                            key={entry.rank}
                            className={`grid grid-cols-12 items-center p-4 transition-colors ${entry.isPlayer ? 'bg-yellow-900/20 border-r-4 border-yellow-500' : 'hover:bg-slate-800/50'}`}
                        >
                            <div className="col-span-2 text-center text-xl font-bold text-slate-500 font-mono">
                                #{entry.rank}
                            </div>
                            <div className="col-span-7 pr-2">
                                <div className={`font-bold text-lg ${entry.isPlayer ? 'text-yellow-400' : 'text-white'}`}>
                                    {entry.name} {entry.isPlayer && '(شما)'}
                                </div>
                                <div className="text-xs text-slate-400">{entry.title}</div>
                            </div>
                            <div className="col-span-3 text-center text-cyan-400 font-mono text-xl font-bold">
                                {entry.score.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* === VICTORY MODAL === */}
      {showVictoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg animate-fadeIn">
              <div className="bg-gradient-to-b from-slate-900 to-black border-2 border-yellow-500 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.5)] animate-modalZoom">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
                  <div className="text-6xl mb-4 animate-bounce">🎁</div>
                  <h2 className="text-3xl font-grunge text-yellow-500 mb-2">تبریک قهرمان!</h2>
                  <p className="text-slate-300 mb-6">شما برنده <span className="text-white font-bold border-b border-yellow-500">{prize}</span> شدید.</p>
                  <button 
                      onClick={handleWhatsAppRedirect}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl text-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-lg"
                  >
                      دریافت جایزه و مشاوره با کوچ‌ها 🚀
                  </button>
                  <button onClick={() => setShowVictoryModal(false)} className="mt-4 text-slate-500 text-sm hover:text-white">بستن</button>
              </div>
          </div>
      )}

    </div>
  );
};

export default ResultScreen;