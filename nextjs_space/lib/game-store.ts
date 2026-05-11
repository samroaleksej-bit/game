import { create } from 'zustand';
import { GameState, District, DistrictId, Resources, LogEntry } from './game-types';
import { getDistrictItems } from './district-rewards';

const INITIAL_RESOURCES: Resources = {
  gold: 10,
  influence: 10,
  recruits: 5,
  loyalty: 100,
};

const DISTRICTS_CONFIG: Record<DistrictId, Omit<District, 'progress'>> = {
  horgovzi: {
    id: 'horgovzi',
    name: 'Horgovzi',
    displayName: '🏪 Торговцы',
    baseResources: { gold: 2 },
    description: 'Торговые гильдии города',
    benefits: ['Артефакты', '+2 Золота в день'],
  },
  siraja: {
    id: 'siraja',
    name: 'Siraja',
    displayName: '⚔️ Стража',
    baseResources: { gold: 1, influence: 1 },
    description: 'Городская стража и охрана',
    benefits: ['Обмундирование', '+1 Золото, +1 Влияние в день'],
  },
  gnil: {
    id: 'gnil',
    name: 'Gnil',
    displayName: '💀 Гниль',
    baseResources: { recruits: 2 },
    description: 'Подземелья и тёмные места',
    benefits: ['Выживаемость', '+2 Рекрута в день'],
  },
  killer: {
    id: 'killer',
    name: 'Killer',
    displayName: '🗡️ Убийцы',
    baseResources: { influence: 2 },
    description: 'Гильдия убийц и наёмников',
    benefits: ['Знания', '+2 Влияния в день'],
  },
  jiloy: {
    id: 'jiloy',
    name: 'Jiloy',
    displayName: '🏘️ Жилой',
    baseResources: { recruits: 1, gold: 1 },
    description: 'Жилой район города',
    benefits: ['Рекруты', '+1 Рекрут, +1 Золото в день'],
  },
  asian: {
    id: 'asian',
    name: 'Asian',
    displayName: '💎 Интриги',
    baseResources: { loyalty: 10, influence: 1 },
    description: 'Дом интриг и развлечений',
    benefits: ['Лояльность', '+10 Лояльности, +1 Влияния в день'],
  },
  znania: {
    id: 'znania',
    name: 'Znania',
    displayName: '📚 Жрецы',
    baseResources: { influence: 1 },
    description: 'Храм знаний и мудрости',
    benefits: ['Навыки', '+1 Влияния в день'],
  },
};

const createInitialDistricts = (): Record<DistrictId, District> => {
  const districts: Record<DistrictId, District> = {} as any;
  (Object.entries(DISTRICTS_CONFIG) as [DistrictId, any][]).forEach(([key, config]) => {
    districts[key] = { ...config, progress: 0 };
  });
  return districts;
};

export interface GameStore extends GameState {
  completeDay: () => void;
  resetGame: () => void;
  giveOrder: (districtId: DistrictId) => void;
  setResources: (resources: Resources) => void;
  getDistrictBonuses: (districtId: DistrictId) => Partial<Resources>;
  getProgressPercentage: (districtId: DistrictId) => number;
}

const createGameStore = () =>
  create<GameStore>((set, get) => ({
    currentDay: 1,
    totalDays: 14,
    resources: INITIAL_RESOURCES,
    districts: createInitialDistricts(),
    ordersUsedToday: false,
    log: [],

    getDistrictBonuses: (districtId: DistrictId) => {
      const state = get();
      const district = state.districts[districtId];
      const progress = district.progress;
      const percentage = (progress / 14) * 100;

      const baseBonus = district.baseResources;
      const scaledBonus: Partial<Resources> = {};

      (Object.entries(baseBonus) as [keyof Resources, number][]).forEach(([key, value]) => {
        if (percentage < 25) {
          scaledBonus[key] = Math.floor(value * 0.5);
        } else if (percentage < 50) {
          scaledBonus[key] = Math.floor(value * 0.75);
        } else if (percentage < 100) {
          scaledBonus[key] = value;
        } else {
          scaledBonus[key] = Math.floor(value * 1.25);
        }
      });

      return scaledBonus;
    },

    getProgressPercentage: (districtId: DistrictId) => {
      const state = get();
      const district = state.districts[districtId];
      return (district.progress / 14) * 100;
    },

    giveOrder: (districtId: DistrictId) => {
      const state = get();
      if (state.ordersUsedToday) {
        console.warn('Order already used today');
        return;
      }

      set((prevState) => ({
        districts: {
          ...prevState.districts,
          [districtId]: {
            ...prevState.districts[districtId],
            progress: Math.min(prevState.districts[districtId].progress + 1, 14),
          },
        },
        ordersUsedToday: true,
      }));
    },

    setResources: (resources: Resources) => {
      set({
        resources: {
          gold: Math.max(0, Math.floor(resources.gold)),
          influence: Math.max(0, Math.floor(resources.influence)),
          recruits: Math.max(0, Math.floor(resources.recruits)),
          loyalty: Math.max(0, Math.min(100, Math.floor(resources.loyalty))),
        },
      });
    },

    completeDay: () => {
      const state = get();

      let dailyIncome: Resources = {
        gold: 0,
        influence: 0,
        recruits: 0,
        loyalty: 0,
      };

      (Object.keys(state.districts) as DistrictId[]).forEach((districtId) => {
        const bonuses = state.getDistrictBonuses(districtId);
        (Object.entries(bonuses) as [keyof Resources, number][]).forEach(([key, value]) => {
          dailyIncome[key] += value;
        });
      });

      // \u0421\u043e\u0431\u0438\u0440\u0430\u0435\u043c \u043f\u0440\u0435\u0434\u043c\u0435\u0442\u044b \u043e\u0442 \u0440\u0430\u0439\u043e\u043d\u043e\u0432
      const itemLogs: string[] = [];
      (Object.keys(state.districts) as DistrictId[]).forEach((districtId) => {
        const district = state.districts[districtId];
        const items = getDistrictItems(districtId, district.progress);
        items.forEach((it) => {
          itemLogs.push(`${district.displayName}: ${it.label} (${it.rarity})`);
        });
      });

      set((prevState) => {
        const newResources: Resources = {
          gold: Math.max(0, prevState.resources.gold + dailyIncome.gold),
          influence: Math.max(0, prevState.resources.influence + dailyIncome.influence),
          recruits: Math.max(0, prevState.resources.recruits + dailyIncome.recruits),
          loyalty: Math.max(0, Math.min(100, prevState.resources.loyalty + dailyIncome.loyalty)),
        };

        const newLog: LogEntry[] = [
          ...itemLogs.map((t) => ({ day: prevState.currentDay, text: t })),
          ...prevState.log,
        ].slice(0, 50);

        return {
          resources: newResources,
          currentDay: Math.min(prevState.currentDay + 1, prevState.totalDays),
          ordersUsedToday: false,
          log: newLog,
        };
      });
    },

    resetGame: () => {
      set({
        currentDay: 1,
        totalDays: 14,
        resources: INITIAL_RESOURCES,
        districts: createInitialDistricts(),
        ordersUsedToday: false,
        log: [],
      });
    },
  }));

export const useGameStore = createGameStore();
