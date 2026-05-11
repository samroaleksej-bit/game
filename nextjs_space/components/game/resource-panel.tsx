'use client';

import { Resources } from '@/lib/game-types';
import { motion } from 'framer-motion';

interface ResourcePanelProps {
  resources: Resources;
  onChangeResources?: (patch: Partial<Resources>) => void;
}

const ResourceIcon = ({ type }: { type: keyof Resources }) => {
  const icons: Record<keyof Resources, string> = {
    gold: '🪙',
    influence: '👑',
    recruits: '⚔️',
    loyalty: '❤️',
  };
  return icons[type];
};

const ResourceLabel = ({ type }: { type: keyof Resources }) => {
  const labels: Record<keyof Resources, string> = {
    gold: 'Золото',
    influence: 'Влияние',
    recruits: 'Рекруты',
    loyalty: 'Лояльность',
  };
  return labels[type];
};

export const ResourcePanel: React.FC<ResourcePanelProps> = ({ resources, onChangeResources }) => {
  const resourceTypes: (keyof Resources)[] = ['gold', 'influence', 'recruits', 'loyalty'];

  const canEdit = typeof onChangeResources === 'function';

  const handleEdit = () => {
    if (!canEdit) return;

    const gold = Number(prompt('Золото:', String(resources.gold)) ?? resources.gold);
    const influence = Number(prompt('Влияние:', String(resources.influence)) ?? resources.influence);
    const recruits = Number(prompt('Рекруты:', String(resources.recruits)) ?? resources.recruits);
    const loyalty = Number(prompt('Лояльность:', String(resources.loyalty)) ?? resources.loyalty);

    if ([gold, influence, recruits, loyalty].some((v) => Number.isNaN(v))) {
      alert('Ошибка: введи только числа.');
      return;
    }

    onChangeResources({
      gold,
      influence,
      recruits,
      loyalty,
    });
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-600 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-amber-400">Ресурсы Вашего Города</h2>
        {canEdit && (
          <button
            type="button"
            onClick={handleEdit}
            className="px-3 py-1 rounded-md bg-slate-800 border border-amber-500 text-amber-300 text-sm font-bold hover:bg-slate-700 transition"
          >
            ✏️ Изменить
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resourceTypes.map((type) => (
          <motion.div
            key={type}
            className="bg-slate-800 border border-amber-500 rounded-md p-4 text-center"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(217, 119, 6, 0.5)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl mb-2">{ResourceIcon({ type })}</div>
            <p className="text-xs text-gray-400 mb-1">{ResourceLabel({ type })}</p>
            <p className="text-2xl font-bold text-amber-400">{resources[type]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
