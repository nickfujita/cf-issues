import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint<Env> {
  async fetch() {
    return new Response('up');
  }

  myMethod(input: string) {
		return `myMethod: ${this.env.MY_VARIABLE} ${input}`
	}
}
