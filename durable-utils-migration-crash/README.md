## Durable Object Crash on failed migration

This is a minimal example of a durable object that uses durable-utils/sql-migrations to manage a database schema, runs a failed migration, then crashes the durable object instance.

NOTE: This works properly when running locally, but crashes while deployed.

## Steps to Reproduce

1. Run `pnpm install`
2. Run `pnpm run dev`
3. Open http://localhost:8787
4. Observe logs that correctly show our console from the try/catch around this.`_migrations.runAll()`: `[ERROR] Failed to run migrations Error: Cannot add a NOT NULL column with default value NULL: SQLITE_ERROR`
5. Deploy this project using `pnpm run deploy`
6. Tail the logs for the deployed worker `wrangler tail durable-utils-migration-crash`
7. Open the link provide on deploy for the worker (eg. `https://durable-utils-migration-crash.<your-org>.workers.dev`)
8. Observe the durable object crash with log similar to `[ERROR]   Error: internal error; reference = h9n1sn3q57oiprpn66mfvnsj`

## Expected Behavior

The durable object should not crash, and instead should log the error from the try/catch around this.`_migrations.runAll()`: `[ERROR] Failed to run migrations Error: Cannot add a NOT NULL column with default value NULL: SQLITE_ERROR` just like when running locally. This allows us to get a more informative log of the error, and to handle the error in a way that allows the durable object to continue running.

Or if it's intentional to crash the durable object on init because of this migration error, at least provide the exact error message from the error thrown.

## Actual Behavior

The durable object crashes when trying to access it instead of just throwing the error to the promise and allowing us to catch the error in our code.

