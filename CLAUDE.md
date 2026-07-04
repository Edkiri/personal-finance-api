# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal-finance REST API built with **NestJS 10** + **Sequelize** (via `sequelize-typescript`) on **PostgreSQL**. Tracks accounts, expenses, incomes, and debts per authenticated user.

## Commands

The intended workflow is Docker Compose (see `Makefile`):

```bash
make start      # docker-compose up --build -d
make up / down  # start/stop without rebuild
make logs       # tail app logs
make prepare    # run migrations + seed inside the container
make bash       # shell into the personal-finance-api container
```

Local npm scripts:

```bash
npm run dev             # nest start --watch (this is what the container runs)
npm run build           # nest build
npm run lint            # eslint --fix over {src,apps,libs,test}
npm test                # jest (unit specs: *.spec.ts under src/)
npm test -- expense     # run specs matching "expense"
npm run test:e2e        # jest with test/jest-e2e.json
npm run db:migrate      # sequelize-cli migrate (config: src/databases/config/sequelize-config.cjs)
npm run seed            # ts-node src/seeders/index.ts
```

There are currently no `*.spec.ts` files in the tree; `npm test` passes with no suites.

## Architecture

### Module layout
`AppModule` composes one feature module per domain: `users`, `accounts`, `expenses`, `incomes`, `debts`, plus `auth` and the global `databases` module. Each feature module follows the same internal shape:

```
<feature>/
  controllers/   HTTP layer; wraps mutations in DB transactions
  services/      business logic + Sequelize model access
  dtos/          class-validator request shapes
  models/        sequelize-typescript @Table models
  guards/        per-resource ownership checks
```

Note the pre-existing filename typos that imports depend on: `accounts/acount.module.ts` and `debts/models/debt-expense.mode.ts`. Match them exactly.

### Database
- `databases/app-sequelize.module.ts` is `@Global()` and registers **all** models in one `SequelizeModule.forRoot` list. Any new model must be added there. It uses `synchronize: false` — the schema is **not** derived from models.
- Schema changes require a hand-written raw-JS migration in `databases/migrations/` (numeric prefix ordering, e.g. `05_...js`) **and** a matching model update. The two are maintained independently.
- Feature modules expose their models to services via `SequelizeModule.forFeature([...])` in the module file.

### Auth
- Stateless JWT (`@nestjs/jwt`, 7-day expiry, secret from `JWT_SECRET`). No Passport.
- `auth/guards/authenticated.guard.ts` verifies the `Bearer` token, loads the user, and sets `req.user = { userId }`. The `Request.user` type is declared in `src/types/express.d.ts`.
- Controllers gate access with `@UseGuards(AuthenticatedGuard)` and then resource ownership guards (e.g. `IsExpenseOwnerGuard`, `IsAccountOwnerGuard`) that 404/401 based on `req.user.userId` vs. the record's `userId`.

### Money handling
All amounts are stored as `FLOAT` columns but **never** add/subtract them with native `+`/`-`. Use `add`/`subtract` from `src/utils` (decimal.js, rounded to 2 dp). Account balances are mutated by the expense/income/debt services as records are created, updated, or deleted.

### Transactions
Write endpoints open the transaction in the **controller** via `this.sequelize.transaction(async (t) => ...)` and pass the `Transaction` object down into service methods. Services accept `transaction` as a parameter rather than opening their own.

### Debt ↔ Expense coupling
`ExpenseModule` and `DebtModule` have a circular dependency resolved with `forwardRef()`. "Paying a debt" (`DebtExpenseService`) creates an `Expense` under the debt's expense source and records a linking `DebtExpense`. When updating/deleting an expense, the expense controller checks for a linked `DebtExpense` and adjusts/removes it in the same transaction — keep this bookkeeping in sync when touching expense mutations.

## Conventions
- `strictNullChecks` and `noImplicitAny` are **off** in `tsconfig.json`.
- Global `ValidationPipe` runs with `whitelist` + `forbidNonWhitelisted`, so every request field must be declared in a DTO with class-validator decorators or the request is rejected. `enableImplicitConversion` is on (query strings coerce to typed values).
- `ClassSerializerInterceptor` is global; controllers often return `model.toJSON()`.
- Config is read directly from `process.env` via `dotenv.config()` at multiple call sites; there is no config module yet (noted as a TODO in `app-sequelize.module.ts`).
