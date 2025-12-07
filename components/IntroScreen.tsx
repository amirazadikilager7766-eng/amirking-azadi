import React, { useState } from 'react';
import { CharacterClass } from '../types';

interface IntroScreenProps {
  onStart: (name: string, phoneNumber: string, playerClass: CharacterClass) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState<'info' | 'class'>('info');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  const handleNext = () => {
    if (name && phoneNumber) setStep('class');
  };

  const handleStartGame = () => {
    if (!name || !phoneNumber || !selectedClass) return;
    setIsEntering(true);
    onStart(name, phoneNumber, selectedClass);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-10 md:py-0">
      
      {/* Background Overlay for Desktop/General atmosphere */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className={`relative z-10 w-full max-w-6xl mx-auto px-4 transition-all duration-1000 ${isEntering ? 'opacity-0 scale-95' : 'opacity-100'}`}>
        
        {/* STEP 1: INFO FORM */}
        {step === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Right Column: Image (Visible on Mobile as a separate element, next to form) */}
                <div className="order-1 md:order-2 flex justify-center relative">
                    <div className="relative w-[280px] h-[280px] md:w-[450px] md:h-[450px]">
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[60px] md:blur-[100px] opacity-20 animate-pulse"></div>
                        <img 
                            src="https://hosseinsohrabi.me/seminar/wp-content/uploads/2025/11/MG_5746-2.jpg" 
                            alt="Master" 
                            className="relative z-10 w-full h-full object-cover rounded-3xl border-4 border-yellow-600/50 shadow-[0_0_40px_rgba(234,179,8,0.4)] mask-image-gradient hover:scale-105 transition-transform duration-700"
                            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
                        />
                        <div className="absolute -top-8 -right-8 md:-top-12 md:-right-12 text-5xl md:text-7xl animate-float drop-shadow-lg">🍉</div>
                        <div className="absolute top-1/2 -left-8 md:-left-16 text-3xl md:text-5xl animate-float opacity-80" style={{ animationDelay: '1.5s' }}>🔥</div>
                    </div>
                </div>

                {/* Left Column: Form */}
                <div className="order-2 md:order-1 mt-6 md:mt-0">
                    <div className="text-center md:text-right mb-8">
                        <h1 className="text-4xl md:text-7xl font-grunge text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-600 drop-shadow-[0_4px_10px_rgba(220,38,38,0.8)] mb-4 md:mb-6 leading-tight">
                            یلدای بیزینسی ۲۰۷۷
                        </h1>
                        <p className="text-base md:text-xl text-cyan-100 font-light leading-relaxed drop-shadow-md px-2 md:px-0">
                            اینجا نقطه‌ی شروع تحول توست. در بلندترین شب سال، مسیر موفقیت کسب‌وکارت را روشن کن.
                        </p>
                    </div>

                    <div className="bg-slate-900/80 backdrop-blur-md border border-yellow-600/30 p-6 md:p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-lg mb-2 font-grunge text-yellow-500">نام فرمانده (شما)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950/60 border border-slate-600 text-white px-4 py-3 rounded-xl focus:border-red-500 focus:bg-slate-900 focus:outline-none transition-all placeholder-slate-600 font-grunge text-xl tracking-wide"
                                    style={{ fontFamily: 'Gramophone, sans-serif' }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="مثال: آرش کمانگیر"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-lg mb-2 font-grunge text-yellow-500">شماره تماس (جهت دریافت گنجینه)</label>
                                <input 
                                    type="tel" 
                                    className="w-full bg-slate-950/60 border border-slate-600 text-white px-4 py-3 rounded-xl focus:border-red-500 focus:bg-slate-900 focus:outline-none transition-all text-left dir-ltr placeholder-slate-600 font-grunge text-xl tracking-widest"
                                    style={{ fontFamily: 'Gramophone, sans-serif' }}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="0912..."
                                />
                            </div>

                            <button 
                                onClick={handleNext}
                                disabled={!name || !phoneNumber}
                                className={`
                                    w-full mt-6 py-4 rounded-xl font-bold text-xl shadow-lg transition-all relative overflow-hidden group font-grunge
                                    ${!name || !phoneNumber ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:scale-[1.02]'}
                                `}
                            >
                                انتخاب تخصص و شروع ⚔️
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )}

        {/* STEP 2: CLASS SELECTION */}
        {step === 'class' && (
            <div className="flex flex-col items-center animate-float" style={{ animationDuration: '0.5s', animationIterationCount: 1 }}>
                <h2 className="text-3xl md:text-5xl font-grunge text-yellow-400 mb-8 drop-shadow-lg text-center">
                    نقش خود را در این نبرد انتخاب کنید
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
                    {/* CLASS 1: ARCHER */}
                    <button 
                        onClick={() => setSelectedClass('archer')}
                        className={`relative p-6 rounded-3xl border-2 transition-all hover:scale-105 group overflow-hidden ${selectedClass === 'archer' ? 'bg-red-900/40 border-red-500 ring-4 ring-red-900/50' : 'bg-slate-900/60 border-slate-700 hover:border-red-400'}`}
                    >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏹</div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-grunge">کماندار محتوا</h3>
                        <p className="text-slate-300 text-sm mb-4">متخصص جذب مخاطب و هدف‌گیری دقیق بازار هدف.</p>
                        <div className="text-xs font-mono text-green-400 bg-green-900/30 inline-block px-2 py-1 rounded">
                            ویژگی: انرژی اولیه بیشتر
                        </div>
                    </button>

                    {/* CLASS 2: GUARDIAN */}
                    <button 
                        onClick={() => setSelectedClass('guardian')}
                        className={`relative p-6 rounded-3xl border-2 transition-all hover:scale-105 group overflow-hidden ${selectedClass === 'guardian' ? 'bg-blue-900/40 border-blue-500 ring-4 ring-blue-900/50' : 'bg-slate-900/60 border-slate-700 hover:border-blue-400'}`}
                    >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛡️</div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-grunge">محافظ فروش</h3>
                        <p className="text-slate-300 text-sm mb-4">متخصص حفظ مشتری و مذاکرات سخت.</p>
                        <div className="text-xs font-mono text-green-400 bg-green-900/30 inline-block px-2 py-1 rounded">
                            ویژگی: جان (HP) بیشتر
                        </div>
                    </button>

                    {/* CLASS 3: MAGE */}
                    <button 
                        onClick={() => setSelectedClass('mage')}
                        className={`relative p-6 rounded-3xl border-2 transition-all hover:scale-105 group overflow-hidden ${selectedClass === 'mage' ? 'bg-purple-900/40 border-purple-500 ring-4 ring-purple-900/50' : 'bg-slate-900/60 border-slate-700 hover:border-purple-400'}`}
                    >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔮</div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-grunge">حکیم استراتژی</h3>
                        <p className="text-slate-300 text-sm mb-4">متخصص سیستم‌سازی و هوش مصنوعی.</p>
                        <div className="text-xs font-mono text-green-400 bg-green-900/30 inline-block px-2 py-1 rounded">
                            ویژگی: سکه طلای شروع
                        </div>
                    </button>
                </div>

                <button 
                    onClick={handleStartGame}
                    disabled={!selectedClass}
                    className={`
                        px-12 py-4 rounded-full font-bold text-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all font-grunge
                        ${!selectedClass ? 'bg-slate-800 text-slate-600' : 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:scale-105'}
                    `}
                >
                    ورود به پورتال یلدا 🔥
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default IntroScreen;