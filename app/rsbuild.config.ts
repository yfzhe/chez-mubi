import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginBasicSsl } from "@rsbuild/plugin-basic-ssl";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  html: {
    mountId: "root",
    title: "Chez Mubi",
  },
  plugins: [pluginReact(), pluginBasicSsl()],
});
