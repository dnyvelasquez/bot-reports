import type { TradeResult } from '@/lib/db';

export default function TradeTable({ results }: { results: TradeResult[] }) {
  if (results.length === 0) {
    return (
      <div className="bg-[#0A2844] rounded-xl border border-[#26CFD8]/20 p-16 text-center">
        <p className="text-[#26CFD8]/40 text-sm">No hay trades en el período seleccionado</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A2844] rounded-xl border border-[#26CFD8]/20 overflow-hidden">

      {/* ── Mobile: cards ─────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-[#26CFD8]/10">
        {results.map(r => (
          <div key={r.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{r.symbol}</span>
              <span className={`font-mono font-bold tabular-nums ${r.profit_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {r.profit_usd >= 0 ? '+' : ''}${r.profit_usd.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge color={r.direction === 'LONG' ? 'green' : 'red'}>{r.direction}</Badge>
              <Badge color={r.account_type === 'REAL' ? 'yellow' : 'blue'}>{r.account_type}</Badge>
              <span className="text-gray-400 text-xs self-center">{r.bot_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <Row label="Titular"   value={r.owner_name} />
              <Row label="Cuenta"    value={String(r.mt5_account)} />
              <Row label="Cierre ET" value={r.closed_at_et ?? fallbackEt(r.closed_at)} mono />
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: table ────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#26CFD8]/20">
              {['Fecha cierre (ET)', 'Titular', 'Cuenta MT5', 'Tipo cuenta', 'Bot', 'Activo', 'Dirección', 'P&L (USD)'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#26CFD8] uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.id} className={`border-b border-[#26CFD8]/10 hover:bg-[#26CFD8]/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-4 py-3 font-mono text-xs text-gray-300 whitespace-nowrap">
                  {r.closed_at_et ?? fallbackEt(r.closed_at)}
                </td>
                <td className="px-4 py-3 text-white font-medium">{r.owner_name}</td>
                <td className="px-4 py-3 font-mono text-gray-300">{r.mt5_account}</td>
                <td className="px-4 py-3">
                  <Badge color={r.account_type === 'REAL' ? 'yellow' : 'blue'}>{r.account_type}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-300">{r.bot_name}</td>
                <td className="px-4 py-3 text-white font-medium">{r.symbol}</td>
                <td className="px-4 py-3">
                  <Badge color={r.direction === 'LONG' ? 'green' : 'red'}>{r.direction}</Badge>
                </td>
                <td className={`px-4 py-3 font-mono font-bold tabular-nums ${r.profit_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {r.profit_usd >= 0 ? '+' : ''}${r.profit_usd.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 border-t border-[#26CFD8]/10 text-xs text-gray-500 text-right">
        {results.length} registros
      </div>
    </div>
  );
}

function fallbackEt(closed_at: string) {
  return new Date(closed_at).toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace('T', ' ');
}

function Badge({ color, children }: { color: 'green' | 'red' | 'yellow' | 'blue'; children: React.ReactNode }) {
  const cls = {
    green:  'bg-green-500/20 text-green-400',
    red:    'bg-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue:   'bg-blue-500/20 text-blue-400',
  }[color];
  return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{children}</span>;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <span className="text-[#26CFD8]/60">{label}</span>
      <span className={`text-gray-300 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </>
  );
}
