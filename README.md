# Bot Reports

Dashboard centralizado para visualizar el rendimiento de los bots de trading. Muestra los resultados de todas las cuentas y bots en un solo lugar, con filtros por titular, cuenta MT5, bot, activo y período.

**Live:** https://bot-reports.vercel.app

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Estilos | Tailwind CSS |
| Base de datos | Neon PostgreSQL (tabla `trade_results`) |
| Deploy | Vercel |

## Funcionalidades

- **Filtros** — Titular MT5, cuenta MT5, bot, activo, período (día / mes / año)
- **Cards de resumen** — Total trades, Net P&L, Win rate, Wins / Losses
- **Tabla de resultados** — Fecha cierre (ET), titular, cuenta, tipo de cuenta, bot, activo, dirección, P&L
- **Vista mobile** — Cada trade se presenta como tarjeta apilada en pantallas pequeñas
- **Autoactualización de dropdowns** — Los filtros se poblan con los valores reales de la DB

## Fuente de datos

Consume la tabla `trade_results` de Neon PostgreSQL, alimentada automáticamente por los bots al cerrar cada operación:

| Bot | Repo |
|---|---|
| SPX500 Bot | [spx500-bot](https://github.com/dnyvelasquez/spx500-bot) |
| EURUSD Bot | [eurusd-bot](https://github.com/dnyvelasquez/eurusd-bot) |

## Desarrollo local

```bash
git clone https://github.com/dnyvelasquez/bot-reports.git
cd bot-reports
npm install
```

Crea `.env.local` con la misma `DATABASE_URL` de los bots:

```env
DATABASE_URL=postgresql://...
```

```bash
npm run dev   # http://localhost:3000
```

## Deploy

Cada push a `master` dispara un redeploy automático en Vercel vía integración GitHub. La variable `DATABASE_URL` está configurada en el proyecto de Vercel.

Para deploy manual:

```bash
vercel --prod
```
