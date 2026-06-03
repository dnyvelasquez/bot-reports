import type { TradeResult } from '@/lib/db';

const HEADERS = ['Fecha cierre (ET)', 'Titular', 'Cuenta MT5', 'Tipo cuenta', 'Bot', 'Activo', 'Dirección', 'P&L (USD)'];

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#26CFD8]/20">
              {HEADERS.map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-[#26CFD8] uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-[#26CFD8]/10 hover:bg-[#26CFD8]/5 transition-colors ${
                  i % 2 !== 0 ? 'bg-white/[0.02]' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-300 whitespace-nowrap">
                  {r.closed_at_et ?? new Date(r.closed_at).toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace('T', ' ')}
                </td>
                <td className="px-4 py-3 text-white font-medium">{r.owner_name}</td>
                <td className="px-4 py-3 font-mono text-gray-300">{r.mt5_account}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    r.account_type === 'REAL'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {r.account_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">{r.bot_name}</td>
                <td className="px-4 py-3 text-white font-medium">{r.symbol}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    r.direction === 'LONG'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {r.direction}
                  </span>
                </td>
                <td className={`px-4 py-3 font-mono font-bold tabular-nums ${
                  r.profit_usd >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
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
