import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare({
		auxiliaryWorkers: [
      {
        configPath: '../worker-b/wrangler.jsonc'
      }
    ],
	})],
});
