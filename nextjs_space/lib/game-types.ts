// Game Types
export type ResourceType = 'gold' | 'influence' | 'recruits' | 'loyalty';

export interface Resources {
  gold: number;
  influence: number;
  recruits: number;
  loyalty: number;
}

export type DistrictId = 'horgovzi' | 'siraja' | 'gnil' | 'killer' | 'jiloy' | 'asian' | 'znania';

export interface ItemReward {
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare';
  category: 'artifact' | 'equipment' | 'knowledge' | 'recruit' | 'survival' | 'intel' | 'loyalty';
  label: string;
}

export interface District {
  id: DistrictId;
  name: string;
  displayName: string;
  progress: number;
  baseResources: Partial<Resources>;
  description: string;
  benefits: string[];
}

export interface LogEntry {
  day: number;
  text: string;
}

export interface GameState {
  currentDay: number;
  totalDays: number;
  resources: Resources;
  districts: Record<DistrictId, District>;
  ordersUsedToday: boolean;
  log: LogEntry[];
}
