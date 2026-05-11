import { DistrictId, ItemReward } from './game-types';

// Возвращает предметы, которые район выдаёт за день в зависимости от уровня захвата (0..14)
export function getDistrictItems(districtId: DistrictId, progress: number): ItemReward[] {
  const tier = progress <= 0 ? 0 : progress < 5 ? 1 : progress < 10 ? 2 : progress < 14 ? 3 : 4;
  const items: ItemReward[] = [];

  const push = (n: number, item: ItemReward) => {
    for (let i = 0; i < n; i++) items.push(item);
  };

  switch (districtId) {
    case 'znania': // Жрецы знаний — артефакты
      if (tier >= 1) push(1, { rarity: 'common', category: 'artifact', label: 'Лёгкий артефакт' });
      if (tier >= 2) push(1, { rarity: 'common', category: 'artifact', label: 'Лёгкий артефакт' });
      if (tier >= 3) {
        push(1, { rarity: 'common', category: 'artifact', label: 'Лёгкий артефакт' });
        push(1, { rarity: 'rare', category: 'artifact', label: 'Редкий артефакт' });
      }
      if (tier >= 4) push(1, { rarity: 'very_rare', category: 'artifact', label: 'Очень редкий артефакт' });
      break;
    case 'siraja': // Стража — обмундирование
      if (tier >= 1) push(1, { rarity: 'common', category: 'equipment', label: 'Лёгкое обмундирование' });
      if (tier >= 2) push(2, { rarity: 'common', category: 'equipment', label: 'Лёгкое обмундирование' });
      if (tier >= 3) {
        push(2, { rarity: 'common', category: 'equipment', label: 'Лёгкое обмундирование' });
        push(1, { rarity: 'rare', category: 'equipment', label: 'Редкое обмундирование' });
      }
      if (tier >= 4) push(1, { rarity: 'very_rare', category: 'equipment', label: 'Элитное обмундирование' });
      break;
    case 'horgovzi': // Торговцы — артефакты/товары
      if (tier >= 1) push(1, { rarity: 'common', category: 'artifact', label: 'Любопытный товар' });
      if (tier >= 2) push(1, { rarity: 'common', category: 'artifact', label: 'Интересный артефакт' });
      if (tier >= 3) {
        push(2, { rarity: 'common', category: 'artifact', label: 'Интересный артефакт' });
        push(1, { rarity: 'rare', category: 'artifact', label: 'Редкий артефакт' });
      }
      if (tier >= 4) push(1, { rarity: 'very_rare', category: 'artifact', label: 'Уникальный артефакт' });
      break;
    case 'killer': // Убийцы — знания о городе
      if (tier >= 1) push(1, { rarity: 'common', category: 'intel', label: 'Слух из города' });
      if (tier >= 2) push(1, { rarity: 'common', category: 'intel', label: 'Сведения о цели' });
      if (tier >= 3) push(1, { rarity: 'rare', category: 'intel', label: 'Тайная информация' });
      if (tier >= 4) push(1, { rarity: 'very_rare', category: 'intel', label: 'Компромат на знать' });
      break;
    case 'gnil': // Гниль — выживаемость
      if (tier >= 1) push(1, { rarity: 'common', category: 'survival', label: 'Знание трущоб' });
      if (tier >= 2) push(1, { rarity: 'common', category: 'survival', label: 'Снадобье выживания' });
      if (tier >= 3) push(1, { rarity: 'rare', category: 'survival', label: 'Тайный путь отхода' });
      if (tier >= 4) push(1, { rarity: 'very_rare', category: 'survival', label: 'Связь с владыкой Гнили' });
      break;
    case 'jiloy': // Жилой — рекруты (отдельно учитывается ресурсом, но логируем)
      if (tier >= 1) push(1, { rarity: 'common', category: 'recruit', label: 'Новобранец' });
      if (tier >= 3) push(1, { rarity: 'rare', category: 'recruit', label: 'Опытный солдат' });
      break;
    case 'asian': // Азиатский (интриги/проститутки) — лояльность
      if (tier >= 1) push(1, { rarity: 'common', category: 'loyalty', label: 'Слух поддержки' });
      if (tier >= 3) push(1, { rarity: 'rare', category: 'loyalty', label: 'Преданный сторонник' });
      break;
  }
  return items;
}

export const RARITY_STYLE: Record<ItemReward['rarity'], { color: string; label: string }> = {
  common: { color: 'text-slate-300', label: 'Обычный' },
  uncommon: { color: 'text-green-400', label: 'Необычный' },
  rare: { color: 'text-blue-400', label: 'Редкий' },
  very_rare: { color: 'text-purple-400', label: 'Очень редкий' },
};
