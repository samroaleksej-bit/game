'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type RollResult = {
  d20: number;
  modifier: number;
  total: number;
  dc: number;
  success: boolean;
  crit: 'success' | 'fail' | null;
};

export const DiceRoller: React.FC = () => {
  const [dc, setDc] = useState<number>(12);
  const [modifier, setModifier] = useState<number>(0);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);

  const roll = () => {
    setRolling(true);
    setResult(null);
    setTimeout(() => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const total = d20 + modifier;
      const success = total >= dc;
      const crit = d20 === 20 ? 'success' : d20 === 1 ? 'fail' : null;
      const r: RollResult = { d20, modifier, total, dc, success, crit };
      setResult(r);
      setHistory((h) => [r, ...h].slice(0, 8));
      setRolling(false);
    }, 600);
  };

  const verdictText = !result
    ? ''
    : result.crit === 'success'
    ? 'КРИТИЧЕСКИЙ УСПЕХ!'
    : result.crit === 'fail'
    ? 'ПРОВАЛ!'
    : result.success
    ? 'Успех'
    : 'Неудача';

  const verdictColor = !result
    ? ''
    : result.crit === 'success'
    ? 'text-yellow-300'
    : result.crit === 'fail'
    ? 'text-red-500'
    : result.success
    ? 'text-green-400'
    : 'text-red-400';

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-600 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
        🎲 Кубик d20 — проверка
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <label className="flex flex-col text-xs text-gray-300">
          Сложность (DC)
          <input
            type="number"
            value={dc}
            onChange={(e) => setDc(parseInt(e.target.value || '0', 10))}
            className="mt-1 bg-slate-700 border border-amber-600/50 rounded px-2 py-1 text-amber-300 font-bold"
          />
        </label>
        <label className="flex flex-col text-xs text-gray-300">
          Модификатор
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value || '0', 10))}
            className="mt-1 bg-slate-700 border border-amber-600/50 rounded px-2 py-1 text-amber-300 font-bold"
          />
        </label>
      </div>

      <div className="flex gap-2 mb-3">
        {[10, 12, 15, 18, 20].map((q) => (
          <button
            key={q}
            onClick={() => setDc(q)}
            className="flex-1 text-xs py-1 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 border border-amber-700/40"
          >
            DC {q}
          </button>
        ))}
      </div>

      <motion.button
        onClick={roll}
        disabled={rolling}
        className="w-full py-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-amber-500/50 disabled:opacity-60"
        whileHover={{ scale: rolling ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {rolling ? 'Бросок...' : '🎲 Бросить d20'}
      </motion.button>

      <AnimatePresence mode="wait">
        {rolling && (
          <motion.div
            key="rolling"
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="inline-block text-5xl"
              animate={{ rotate: [0, 360, 720, 1080] }}
              transition={{ duration: 0.6 }}
            >
              🎲
            </motion.div>
          </motion.div>
        )}

        {result && !rolling && (
          <motion.div
            key="result"
            className="mt-4 p-3 rounded-md bg-slate-950/60 border border-amber-700/50 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl font-bold text-amber-300">{result.d20}</div>
            <div className="text-xs text-gray-400 mb-1">
              {result.d20} {result.modifier >= 0 ? '+' : ''}
              {result.modifier} = <b className="text-amber-300">{result.total}</b> вс DC {result.dc}
            </div>
            <div className={`text-lg font-bold ${verdictColor}`}>{verdictText}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-1">История бросков:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {history.map((r, i) => (
              <div
                key={i}
                className="text-xs flex justify-between bg-slate-800/60 rounded px-2 py-1"
              >
                <span className="text-gray-300">
                  d20: <b className="text-amber-300">{r.d20}</b> ({r.modifier >= 0 ? '+' : ''}
                  {r.modifier}) = {r.total} vs DC {r.dc}
                </span>
                <span
                  className={
                    r.crit === 'success'
                      ? 'text-yellow-300'
                      : r.crit === 'fail'
                      ? 'text-red-500'
                      : r.success
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {r.crit === 'success' ? 'КРИТ' : r.crit === 'fail' ? 'ПРОВ' : r.success ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
