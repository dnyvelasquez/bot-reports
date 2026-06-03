'use client';

import { useRouter } from 'next/navigation';
import type { FilterOptions } from '@/lib/db';

type Period = 'day' | 'month' | 'year';

interface Current {
  period: Period;
  date: string;
  owner?: string;
  bot?: string;
  symbol?: string;
  account?: string;
}

interface Props {
  options: FilterOptions;
  current: Current;
}

const SELECT_CLS =
  'bg-[#001D35] border border-[#26CFD8]/30 text-white rounded-lg px-3 py-2 text-sm ' +
  'focus:outline-none focus:border-[#26CFD8] min-w-[130px]';

const LABEL_CLS = 'text-xs text-[#26CFD8] font-medium uppercase tracking-wider';

export default function FilterBar({ options, current }: Props) {
  const router = useRouter();

  function navigate(updates: Partial<Current>) {
    const next: Current = { ...current, ...updates };

    // Adjust date format when period changes
    if (updates.period) {
      const todayET = new Date()
        .toLocaleDateString('sv-SE', { timeZone: 'America/New_York' })
        .slice(0, 10);
      if (updates.period === 'day')   next.date = todayET;
      if (updates.period === 'month') next.date = (current.date || todayET).slice(0, 7);
      if (updates.period === 'year')  next.date = (current.date || todayET).slice(0, 4);
    }

    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
    }
    router.push('?' + params.toString());
  }

  const periods: { value: Period; label: string }[] = [
    { value: 'day', label: 'Día' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="bg-[#0A2844] rounded-xl p-4 border border-[#26CFD8]/20">
      <div className="flex flex-wrap gap-4 items-end">

        {/* Period toggle */}
        <div className="space-y-1.5">
          <p className={LABEL_CLS}>Período</p>
          <div className="flex rounded-lg overflow-hidden border border-[#26CFD8]/30">
            {periods.map(p => (
              <button
                key={p.value}
                onClick={() => navigate({ period: p.value })}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  current.period === p.value
                    ? 'bg-[#26CFD8] text-[#001D35] font-semibold'
                    : 'text-[#26CFD8] hover:bg-[#26CFD8]/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date input */}
        <div className="space-y-1.5">
          <p className={LABEL_CLS}>Fecha</p>
          {current.period === 'day' && (
            <input
              type="date"
              value={current.date}
              onChange={e => navigate({ date: e.target.value })}
              className={SELECT_CLS}
            />
          )}
          {current.period === 'month' && (
            <input
              type="month"
              value={current.date}
              onChange={e => navigate({ date: e.target.value })}
              className={SELECT_CLS}
            />
          )}
          {current.period === 'year' && (
            <select
              value={current.date}
              onChange={e => navigate({ date: e.target.value })}
              className={SELECT_CLS}
            >
              {years.map(y => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          )}
        </div>

        {/* Titular */}
        <div className="space-y-1.5">
          <p className={LABEL_CLS}>Titular</p>
          <select
            value={current.owner ?? ''}
            onChange={e => navigate({ owner: e.target.value || undefined })}
            className={SELECT_CLS}
          >
            <option value="">Todos</option>
            {options.owners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Cuenta MT5 */}
        <div className="space-y-1.5">
          <p className={LABEL_CLS}>Cuenta MT5</p>
          <select
            value={current.account ?? ''}
            onChange={e => navigate({ account: e.target.value || undefined })}
            className={SELECT_CLS}
          >
            <option value="">Todas</option>
            {options.accounts.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Bot */}
        <div className="space-y-1.5">
          <p className={LABEL_CLS}>Bot</p>
          <select
            value={current.bot ?? ''}
            onChange={e => navigate({ bot: e.target.value || undefined })}
            className={SELECT_CLS}
          >
            <option value="">Todos</option>
            {options.bots.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Activo */}
        <div className="space-y-1.5">
          <p className={LABEL_CLS}>Activo</p>
          <select
            value={current.symbol ?? ''}
            onChange={e => navigate({ symbol: e.target.value || undefined })}
            className={SELECT_CLS}
          >
            <option value="">Todos</option>
            {options.symbols.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

      </div>
    </div>
  );
}
