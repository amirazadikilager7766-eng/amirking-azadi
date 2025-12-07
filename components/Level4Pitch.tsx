import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats } from '../types';

interface Level4Props {
  onComplete: (stats: PlayerStats, historyLog: string) => void;
  currentStats: PlayerStats;
}

const Level4Pitch: React.FC<Level4Props> = ({ onComplete, currentStats }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [audioData, setAudioData] = useState<number[]>(new Array(10).fill(10));
  const [volumeScore, setVolumeScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'done'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32;
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      setIsRecording(true);
      setStatus('recording');
      visualize();
      startTimer();
    } catch (err) {
      console.error("Microphone denied", err);
      alert("دسترسی به میکروفون داده نشد. شبیه‌سازی انجام می‌شود.");
      // Simulated Fallback
      simulateRecording();
    }
  };

  const simulateRecording = () => {
      setIsRecording(true);
      setStatus('recording');
      let t = 10;
      const interval = setInterval(() => {
          t -= 1;
          setTimeLeft(t);
          setAudioData(Array.from({length: 10}, () => Math.random() * 50 + 20));
          if (t <= 0) {
              clearInterval(interval);
              finishRecording(85); // Dummy high score
          }
      }, 1000);
  };

  const startTimer = () => {
      let t = 10;
      const interval = setInterval(() => {
          t -= 1;
          setTimeLeft(t);
          if (t <= 0) {
              clearInterval(interval);
              finishRecording();
          }
      }, 1000);
  };

  const visualize = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
        if (!isRecording) return;
        analyserRef.current!.getByteFrequencyData(dataArray);
        
        // Update visual bars state
        const smallData = Array.from(dataArray).slice(0, 10); 
        setAudioData(smallData as number[]);
        
        // Calculate energy for score
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setVolumeScore(prev => Math.max(prev, average)); // Keep max peak

        animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const finishRecording = (simulatedScore?: number) => {
      if (sourceRef.current) {
          sourceRef.current.disconnect();
          // Stop all tracks
          (sourceRef.current.mediaStream as MediaStream).getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      
      setIsRecording(false);
      setStatus('processing');

      // Calculate Final Score
      // Real score is based on volume/energy detected (simulating passion)
      // Normalized to 0-100
      let finalScore = simulatedScore || Math.min(100, Math.floor((volumeScore / 150) * 100));
      if (finalScore < 40) finalScore = 50; // Mercy score

      setTimeout(() => {
          setStatus('done');
          // Add to Total Score
          const totalScore = currentStats.quizScore + finalScore * 5; // x5 multiplier for this level
          
          onComplete({
              ...currentStats,
              quizScore: totalScore,
              voiceScore: finalScore,
              gold: currentStats.gold + 200
          }, `Pitch Challenge Score: ${finalScore}`);
      }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 relative z-10">
      <h2 className="text-3xl md:text-5xl font-grunge text-cyan-400 mb-8 drop-shadow-lg text-center">
         چالش فروش صوتی 🎙️
      </h2>
      
      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center">
          
          {status === 'idle' && (
              <>
                  <p className="text-xl text-slate-300 mb-8 leading-loose">
                      غول بیزینس روبروی شماست. شما فقط <span className="text-red-500 font-bold">۱۰ ثانیه</span> فرصت دارید تا محصول "انار جادویی" را به او بفروشید. 
                      <br/>
                      <span className="text-sm text-yellow-500 mt-2 block">نکته: با انرژی و صدای رسا صحبت کنید! هوش مصنوعی اشتیاق شما را می‌سنجد.</span>
                  </p>
                  <button 
                    onClick={startRecording}
                    className="w-24 h-24 rounded-full bg-red-600 border-4 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center text-4xl hover:scale-110 transition-transform animate-pulse"
                  >
                      🎙️
                  </button>
                  <p className="mt-4 text-slate-400">برای ضبط کلیک کنید</p>
              </>
          )}

          {status === 'recording' && (
              <>
                  <div className="text-6xl font-mono text-red-500 font-bold mb-8 animate-pulse">
                      00:0{timeLeft}
                  </div>
                  
                  {/* Visualizer */}
                  <div className="visualizer-container mb-8 h-32 items-end justify-center gap-2 flex">
                      {audioData.map((val, i) => (
                          <div 
                            key={i} 
                            className="w-4 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(10, val)}px` }}
                          ></div>
                      ))}
                  </div>

                  <p className="text-cyan-300 text-lg animate-pulse">درحال ضبط... با قدرت بفروش!</p>
              </>
          )}

          {status === 'processing' && (
              <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xl font-grunge text-cyan-400">هوش مصنوعی در حال تحلیل انرژی کلام شماست...</p>
              </div>
          )}

      </div>
    </div>
  );
};

export default Level4Pitch;