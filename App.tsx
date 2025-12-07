import React, { useState, useEffect, useRef } from 'react';
import IntroScreen from './components/IntroScreen';
import Level1Desert from './components/Level1Desert';
import Level2Arena from './components/Level2Arena';
import Level3Boss from './components/Level3Boss';
import Level4Pitch from './components/Level4Pitch';
import ResultScreen from './components/ResultScreen';
import GameHUD from './components/GameHUD';
import LoadingScreen from './components/LoadingScreen';
import { GameState, PlayerStats, CharacterClass } from './types';

const INITIAL_STATS: PlayerStats = {
  hp: 100,
  maxHp: 100,
  energy: 50,
  gold: 0,
  seals: 0,
  pomegranates: 0,
  name: '',
  phoneNumber: '',
  title: 'تاجر نوپا',
  inventory: [],
  quizScore: 0,
  
  // RPG Stats
  enemyHp: 100,
  maxEnemyHp: 100,
  comboMultiplier: 1,
  maxCombo: 0,
  activePowerups: []
};

const MUSIC_URL = "https://dl.boxmusics.ir/songs/400/7/Kalmast%20-%20Shabe%20Yalda.mp3";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'intro',
    stats: INITIAL_STATS,
    history: [],
    levelProgress: 0,
    isMusicPlaying: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize Audio
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    // Parallax Listener
    const handleMouseMove = (e: MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) - 0.5,
            y: (e.clientY / window.innerHeight) - 0.5
        });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (gameState.isMusicPlaying) {
      audioRef.current.pause();
      setGameState(prev => ({ ...prev, isMusicPlaying: false }));
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      setGameState(prev => ({ ...prev, isMusicPlaying: true }));
    }
  };

  const updateGameState = (newStats: PlayerStats, log: string, nextPhase: GameState['phase']) => {
    setIsLoading(true);
    
    // Smooth transition with the GIF loader
    setTimeout(() => {
        setGameState(prev => ({
            ...prev,
            phase: nextPhase,
            stats: newStats,
            history: [...prev.history, log],
            levelProgress: prev.levelProgress + 1
        }));
        setIsLoading(false);
    }, 3500); 
  };

  const handleStart = (name: string, phoneNumber: string, playerClass: CharacterClass) => {
    setIsLoading(true);
    
    // Apply Class Bonuses
    let startStats = { ...INITIAL_STATS, name, phoneNumber, playerClass };
    if (playerClass === 'archer') { // Content Archer
       startStats.energy = 80;
       startStats.title = "کماندار محتوا";
    } else if (playerClass === 'guardian') { // Sales Guardian
       startStats.hp = 120;
       startStats.maxHp = 120;
       startStats.title = "محافظ فروش";
    } else if (playerClass === 'mage') { // Strategy Mage
       startStats.gold = 500;
       startStats.title = "حکیم استراتژی";
    }

    // Attempt to play music on start interaction
    if (audioRef.current) {
        audioRef.current.play().then(() => {
            setGameState(prev => ({ ...prev, isMusicPlaying: true }));
        }).catch(err => console.log("Auto-play blocked, user needs to toggle manually"));
    }

    setTimeout(() => {
        setGameState(prev => ({
            ...prev,
            phase: 'level1',
            stats: startStats
        }));
        setIsLoading(false);
    }, 3000);
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case 'intro':
        return <IntroScreen onStart={handleStart} />;
      case 'level1':
        return <Level1Desert 
                  currentStats={gameState.stats} 
                  onComplete={(stats, log) => updateGameState(stats, log, 'level2')} 
               />;
      case 'level2':
        return <Level2Arena 
                  currentStats={gameState.stats} 
                  onComplete={(stats, log) => updateGameState(stats, log, 'level3')} 
               />;
      case 'level3':
        return <Level3Boss 
                  currentStats={gameState.stats} 
                  onComplete={(stats, log) => updateGameState(stats, log, 'level4')} 
               />;
      case 'level4':
        return <Level4Pitch
                  currentStats={gameState.stats} 
                  onComplete={(stats, log) => updateGameState(stats, log, 'result')} 
               />;
      case 'result':
        return <ResultScreen 
                  stats={gameState.stats} 
                  history={gameState.history} 
                  onRestart={() => setGameState({ ...gameState, phase: 'intro', stats: INITIAL_STATS, history: [], levelProgress: 0 })} 
               />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-[Vazirmatn] relative overflow-hidden">
      {/* 3D PARALLAX BACKGROUND LAYERS */}
      {gameState.phase !== 'intro' && (
          <>
            <div className="parallax-layer" style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`, backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)', opacity: 0.5 }}></div>
            <div className="parallax-layer" style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px) scale(1.1)`, backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)' }}></div>
          </>
      )}

      {/* Dynamic Background Image (Static fallback + Parallax movement) */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none parallax-layer" style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) scale(1.05)` }}>
         <img src="https://s8.uupload.ir/files/4771207_9pmd.jpg" className="w-full h-full object-cover" alt="bg" />
      </div>

      {isLoading && <LoadingScreen />}

      {gameState.phase !== 'intro' && gameState.phase !== 'result' && !isLoading && (
        <GameHUD 
            stats={gameState.stats} 
            phase={gameState.phase} 
            isMusicPlaying={!!gameState.isMusicPlaying}
            onToggleMusic={toggleMusic}
        />
      )}
      
      <div className="relative z-10">
         {renderPhase()}
      </div>
    </div>
  );
};

export default App;