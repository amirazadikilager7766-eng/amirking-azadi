import React from 'react';
import { PlayerStats } from '../types';

interface GameHUDProps {
  stats: PlayerStats;
  phase: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ stats, phase, isMusicPlaying, onToggleMusic }) => {
  const isBattle = phase === 'level2';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 pointer-events-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center bg-black/80 backdrop-blur-md border-b border-yellow-600/30 rounded-b-xl p-2 md:px-6 relative shadow-2xl pointer-events-auto">
        
        {/* Profile */}
        <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full border-2 overflow-hidden ${stats.comboMultiplier > 1 ? 'border-red-500 animate-pulse' : 'border-yellow-500'}`}>
                 <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Cyrus" alt="Avatar" className="w-full h-full" />
            </div>
            <div>
                <h3 className="text-yellow-400 font-bold text-sm">{stats.name || "کاربر مهمان"}</h3>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{stats.title}</span>
                   {stats.comboMultiplier > 1 && (
                       <span className="text-xs font-bold text-red-500 animate-pulse combo-fire">COMBO x{stats.comboMultiplier}</span>
                   )}
                </div>
            </div>
        </div>

        {/* Battle Stats (Visible in Level 2) */}
        {isBattle && (
          <div className="flex-1 px-4 w-full md:w-auto mt-2 md:mt-0">
             <div className="flex justify-between text-xs text-slate-400 mb-1">
                 <span>جان شما: {stats.hp}%</span>
                 <span>تورم بازار: {stats.enemyHp}%</span>
             </div>
             <div className="flex gap-2">
                 {/* Player HP */}
                 <div className="h-4 flex-1 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                     <div 
                        className={`h-full transition-all duration-500 ${stats.hp < 30 ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`} 
                        style={{ width: `${stats.hp}%` }}
                     ></div>
                 </div>
                 {/* VS Badge */}
                 <div className="w-6 h-4 flex items-center justify-center bg-red-900 text-[8px] font-bold rounded text-white">VS</div>
                 {/* Enemy HP */}
                 <div className="h-4 flex-1 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                     <div 
                        className="h-full bg-red-600 transition-all duration-500" 
                        style={{ width: `${(stats.enemyHp || 0) / (stats.maxEnemyHp || 100) * 100}%` }}
                     ></div>
                 </div>
             </div>
          </div>
        )}

        {/* Score & Controls */}
        <div className="mt-2 md:mt-0 flex items-center gap-4">
             {/* Music Toggle */}
             <button 
                onClick={onToggleMusic}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isMusicPlaying ? 'bg-green-900/50 border-green-500 text-green-400' : 'bg-slate-800 border-slate-600 text-slate-500'}`}
             >
                {isMusicPlaying ? '🔊' : '🔇'}
             </button>

             <div className="flex flex-col items-end">
                 <span className="text-[10px] text-cyan-400 uppercase tracking-widest">امتیاز کل</span>
                 <span className="text-xl font-bold text-white tabular-nums">{stats.quizScore.toLocaleString()}</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default GameHUD;