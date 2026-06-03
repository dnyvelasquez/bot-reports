import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require', max: 5 });

export interface TradeResult {
  id: number;
  owner_name: string;
  account_type: string;
  mt5_account: number;
  bot_name: string;
  symbol: string;
  profit_usd: number;
  direction: 'LONG' | 'SHORT';
  closed_at: string;
  closed_at_et: string | null;
}

export interface FilterOptions {
  owners: string[];
  bots: string[];
  symbols: string[];
  accounts: string[];
}

export async function getFilterOptions(): Promise<FilterOptions> {
  try {
    const [owners, bots, symbols, accounts] = await Promise.all([
      sql<{ owner_name: string }[]>`SELECT DISTINCT owner_name FROM trade_results ORDER BY owner_name`,
      sql<{ bot_name: string }[]>`SELECT DISTINCT bot_name FROM trade_results ORDER BY bot_name`,
      sql<{ symbol: string }[]>`SELECT DISTINCT symbol FROM trade_results ORDER BY symbol`,
      sql<{ mt5_account: number }[]>`SELECT DISTINCT mt5_account FROM trade_results ORDER BY mt5_account`,
    ]);
    return {
      owners: owners.map(r => r.owner_name),
      bots: bots.map(r => r.bot_name),
      symbols: symbols.map(r => r.symbol),
      accounts: accounts.map(r => String(r.mt5_account)),
    };
  } catch {
    return { owners: [], bots: [], symbols: [], accounts: [] };
  }
}

export async function getTradeResults(filters: {
  owner?: string;
  bot?: string;
  symbol?: string;
  account?: string;
  period: 'day' | 'month' | 'year';
  date: string;
}): Promise<TradeResult[]> {
  const { owner, bot, symbol, account, period, date } = filters;
  try {
    const periodSql =
      period === 'day'
        ? sql`DATE(closed_at AT TIME ZONE 'America/New_York') = ${date}::date`
        : period === 'month'
        ? sql`TO_CHAR(closed_at AT TIME ZONE 'America/New_York', 'YYYY-MM') = ${date}`
        : sql`DATE_PART('year', closed_at AT TIME ZONE 'America/New_York') = ${Number(date)}`;

    return await sql<TradeResult[]>`
      SELECT * FROM trade_results
      WHERE ${periodSql}
        ${owner ? sql`AND owner_name = ${owner}` : sql``}
        ${bot ? sql`AND bot_name = ${bot}` : sql``}
        ${symbol ? sql`AND symbol = ${symbol}` : sql``}
        ${account ? sql`AND mt5_account = ${Number(account)}` : sql``}
      ORDER BY closed_at DESC
      LIMIT 500
    `;
  } catch {
    return [];
  }
}
