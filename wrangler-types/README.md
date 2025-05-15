# Reproduction of tsc type check issue with wrangler binded services
https://github.com/cloudflare/workers-sdk/issues/8902#issuecomment-2813235832

- Project is setup using the cf vite plugin for both worker-a and worker-b
- worker-b is a simple rpc worker that has an env var `MY_VARIABLE`
- worker-a binds worker-b as a service in it's wrangler.jsonc, and sets up the relative path reference to worker-b's wrangler.jsonc in it's `vite.config.ts` file under the cloudflare plugin option `auxiliaryWorkers[0].configPath`
- in worker-a you can confirm operation by running in worker-a folder `npm i && npm run dev`, accessing the server at `http://localhost:5173/`, and it should show the response `myMethod: hello world`
- in worker-a folder you can then run the command `npm run typecheck` to run `tsc`, this then produces the error in question below:
```
../worker-b/src/index.ts:9:32 - error TS2339: Property 'MY_VARIABLE' does not exist on type 'Env'.

9   return `myMethod: ${this.env.MY_VARIABLE} ${input}`
                                 ~~~~~~~~~~~


Found 1 error in ../worker-b/src/index.ts:9
```