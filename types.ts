export type GamePhase = 'intro' | 'level1' | 'level2' | 'level3' | 'level4' | 'result';

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'consumable' | 'relic';
  icon: string;
}

export interface AnalysisData {
  hasBusiness: boolean;
  mainProblem: string;
  goal: string;
  score: number; // For leaderboard
}

export type CharacterClass = 'archer' | 'guardian' | 'mage';

export interface PlayerStats {
  hp: number;        
  maxHp: number;
  energy: number;    
  gold: number;      
  seals: number;     
  pomegranates: number; 
  name: string;
  phoneNumber: string; 
  title: string;
  playerClass?: CharacterClass; 
  inventory: InventoryItem[];
  analysis?: AnalysisData;
  quizScore: number; 
  
  // RPG Combat Stats
  enemyHp?: number;
  maxEnemyHp?: number;
  comboMultiplier: number;
  maxCombo: number;
  activePowerups: string[];
  
  // Voice Level
  voiceScore?: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  title: string;
  isPlayer?: boolean;
}

export interface GameState {
  phase: GamePhase;
  stats: PlayerStats;
  history: string[];
  levelProgress: number;
  isMusicPlaying?: boolean;
}