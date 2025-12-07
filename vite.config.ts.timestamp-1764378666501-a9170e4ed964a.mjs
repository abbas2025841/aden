// vite.config.ts
import { defineConfig } from "file:///D:/%D9%84%D9%84%D8%AA%D8%AC%D8%B1%D8%A8%D9%87/neuaden/node_modules/vite/dist/node/index.js";
import react from "file:///D:/%D9%84%D9%84%D8%AA%D8%AC%D8%B1%D8%A8%D9%87/neuaden/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "file:///D:/%D9%84%D9%84%D8%AA%D8%AC%D8%B1%D8%A8%D9%87/neuaden/node_modules/@replit/vite-plugin-runtime-error-modal/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/%D9%84%D9%84%D8%AA%D8%AC%D8%B1%D8%A8%D9%87/neuaden/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("file:///D:/%D9%84%D9%84%D8%AA%D8%AC%D8%B1%D8%A8%D9%87/neuaden/node_modules/@replit/vite-plugin-cartographer/dist/index.mjs").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  cacheDir: path.resolve(__dirname, "data/cache/vite"),
  server: {
    port: 8010,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxcdTA2NDRcdTA2NDRcdTA2MkFcdTA2MkNcdTA2MzFcdTA2MjhcdTA2NDdcXFxcbmV1YWRlblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcXHUwNjQ0XHUwNjQ0XHUwNjJBXHUwNjJDXHUwNjMxXHUwNjI4XHUwNjQ3XFxcXG5ldWFkZW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6LyVEOSU4NCVEOSU4NCVEOCVBQSVEOCVBQyVEOCVCMSVEOCVBOCVEOSU4Ny9uZXVhZGVuL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xyXG5pbXBvcnQgcnVudGltZUVycm9yT3ZlcmxheSBmcm9tIFwiQHJlcGxpdC92aXRlLXBsdWdpbi1ydW50aW1lLWVycm9yLW1vZGFsXCI7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBydW50aW1lRXJyb3JPdmVybGF5KCksXHJcbiAgICAuLi4ocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXHJcbiAgICBwcm9jZXNzLmVudi5SRVBMX0lEICE9PSB1bmRlZmluZWRcclxuICAgICAgPyBbXHJcbiAgICAgICAgICBhd2FpdCBpbXBvcnQoXCJAcmVwbGl0L3ZpdGUtcGx1Z2luLWNhcnRvZ3JhcGhlclwiKS50aGVuKChtKSA9PlxyXG4gICAgICAgICAgICBtLmNhcnRvZ3JhcGhlcigpLFxyXG4gICAgICAgICAgKSxcclxuICAgICAgICBdXHJcbiAgICAgIDogW10pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiY2xpZW50XCIsIFwic3JjXCIpLFxyXG4gICAgICBcIkBzaGFyZWRcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzaGFyZWRcIiksXHJcbiAgICAgIFwiQGFzc2V0c1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImF0dGFjaGVkX2Fzc2V0c1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICByb290OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImNsaWVudFwiKSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImRpc3QvcHVibGljXCIpLFxyXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgfSxcclxuICBjYWNoZURpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJkYXRhL2NhY2hlL3ZpdGVcIiksXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA4MDEwLFxyXG4gICAgZnM6IHtcclxuICAgICAgc3RyaWN0OiB0cnVlLFxyXG4gICAgICBkZW55OiBbXCIqKi8uKlwiXSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVIsU0FBUyxvQkFBb0I7QUFDOVMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLHlCQUF5QjtBQUppSCxJQUFNLDJDQUEyQztBQU1sTSxJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksS0FBSyxRQUFRLFVBQVU7QUFFekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsSUFDcEIsR0FBSSxRQUFRLElBQUksYUFBYSxnQkFDN0IsUUFBUSxJQUFJLFlBQVksU0FDcEI7QUFBQSxNQUNFLE1BQU0sT0FBTyw0SEFBa0MsRUFBRTtBQUFBLFFBQUssQ0FBQyxNQUNyRCxFQUFFLGFBQWE7QUFBQSxNQUNqQjtBQUFBLElBQ0YsSUFDQSxDQUFDO0FBQUEsRUFDUDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxVQUFVLEtBQUs7QUFBQSxNQUM1QyxXQUFXLEtBQUssUUFBUSxXQUFXLFFBQVE7QUFBQSxNQUMzQyxXQUFXLEtBQUssUUFBUSxXQUFXLGlCQUFpQjtBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTSxLQUFLLFFBQVEsV0FBVyxRQUFRO0FBQUEsRUFDdEMsT0FBTztBQUFBLElBQ0wsUUFBUSxLQUFLLFFBQVEsV0FBVyxhQUFhO0FBQUEsSUFDN0MsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLFVBQVUsS0FBSyxRQUFRLFdBQVcsaUJBQWlCO0FBQUEsRUFDbkQsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLE1BQ1IsTUFBTSxDQUFDLE9BQU87QUFBQSxJQUNoQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
