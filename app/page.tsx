import { getFilterOptions, getTradeResults } from '@/lib/db';
import FilterBar from '@/components/FilterBar';
import StatsCards from '@/components/StatsCards';
import TradeTable from '@/components/TradeTable';

type Period = 'day' | 'month' | 'year';

function todayET(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).slice(0, 10);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const period = ((params.period ?? 'day') as Period);
  const today = todayET();
  const defaultDate =
    period === 'year' ? today.slice(0, 4) :
    period === 'month' ? today.slice(0, 7) :
    today;
  const date = params.date ?? defaultDate;

  const [options, results] = await Promise.all([
    getFilterOptions(),
    getTradeResults({
      owner: params.owner,
      bot: params.bot,
      symbol: params.symbol,
      account: params.account,
      period,
      date,
    }),
  ]);

  return (
    <main className="p-4 md:p-6 space-y-5">
      <FilterBar
        options={options}
        current={{
          period,
          date,
          owner: params.owner,
          bot: params.bot,
          symbol: params.symbol,
          account: params.account,
        }}
      />
      <StatsCards results={results} />
      <TradeTable results={results} />
    </main>
  );
}
