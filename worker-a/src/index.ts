export default {
	async fetch(request, env, ctx): Promise<Response> {
		const testResponse = await env.WORKER_B.myMethod('world');
		return new Response(testResponse);
	},
} satisfies ExportedHandler<WorkerAEnv>;
