import type { TradeResult } from '@/lib/db';

export default function StatsCards({ results }: { results: TradeResult[] }) {
  const total   = results.length;
  const wins    = results.filter(r => r.profit_usd > 0).length;
  const losses  = results.filter(r => r.profit_usd < 0).length;
  const netPnl  = results.reduce((s, r) => s + r.profit_usd, 0);
  const winRate = total > 0 ? (wins / total) * 100 : 0;

  const cards = [
    {
      label: 'Total Trades',
      value: String(total),
      color: 'text-white',
    },
    {
      label: 'Net P&L',
      value: (netPnl >= 0 ? '+' : '') + '$' + netPnl.toFixed(2),
      color: netPnl >= 0 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Win Rate',
      value: winRate.toFixed(1) + '%',
      color: winRate >= 50 ? 'text-green-400' : 'text-yellow-400',
    },
    {
      label: 'Wins / Losses',
      value: `${wins} / ${losses}`,
      color: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.label}
          className="bg-[#0A2844] rounded-xl p-4 border border-[#26CFD8]/20"
        >
          <p className="text-xs text-[#26CFD8] uppercase tracking-wider mb-1.5">{card.label}</p>
          <p className={`text-2xl font-bold tabular-nums ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
