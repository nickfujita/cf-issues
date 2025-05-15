import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject<Env> {
	async sayHello(): Promise<string> {
		return `Hello, from ${this.ctx.id.toString()}!`;
	}

	async testSelfCall(): Promise<string> {
		const id: DurableObjectId = this.env.MY_DURABLE_OBJECT.idFromName("bar");
		const stub = this.env.MY_DURABLE_OBJECT.get(id);
		const greeting = await stub.sayHello();
		return greeting;
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName("foo");
		console.log('foo id', id.toString());
		const stub = env.MY_DURABLE_OBJECT.get(id);
		const greeting = await stub.testSelfCall();

		return new Response(greeting);
	},
} satisfies ExportedHandler<Env>;
