import { DurableObject } from "cloudflare:workers";
import {
    type SQLSchemaMigration,
    SQLSchemaMigrations,
} from 'durable-utils/sql-migrations';

const Migrations: SQLSchemaMigration[] = [
    {
        idMonotonicInc: 1,
        description: 'initial version',
        sql: `
            CREATE TABLE IF NOT EXISTS tenant_info(
                id TEXT PRIMARY KEY,
                name TEXT
            );
						INSERT INTO tenant_info (id, name) VALUES ('1', 'tenant 1');
        `,
    },
    {
        idMonotonicInc: 2,
        description: 'migration',
        sql: `
            ALTER TABLE tenant_info
            ADD description TEXT NOT NULL;
        `,
    }
];

export class MyDurableObject extends DurableObject<Env> {
    _migrations: SQLSchemaMigrations;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this._migrations = new SQLSchemaMigrations({
				doStorage: ctx.storage,
				migrations: Migrations,
		});

		ctx.blockConcurrencyWhile(async () => {
			try {
				await this._migrations.runAll();
			} catch (e) {
				console.error('Failed to run migrations', e);
			}
		});
	}

	async sayHello(name: string): Promise<string> {
		return `Hello, ${name}!`;
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName("foo");
		const stub = env.MY_DURABLE_OBJECT.get(id);
		const greeting = await stub.sayHello("world");
		return new Response(greeting);
	},
} satisfies ExportedHandler<Env>;
