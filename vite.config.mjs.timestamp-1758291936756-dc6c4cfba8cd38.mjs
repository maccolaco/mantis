// vite.config.mjs
import { defineConfig, loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///home/project/node_modules/vite-jsconfig-paths/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = env.VITE_APP_BASE_NAME || "/";
  const PORT = 3e3;
  return {
    base: API_URL,
    server: {
      open: true,
      port: PORT,
      host: true
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: "window"
    },
    resolve: {
      alias: {
        "@ant-design/icons": path.resolve(__vite_injected_original_dirname, "node_modules/@ant-design/icons")
        // Add more aliases as needed
      }
    },
    plugins: [
      react(),
      jsconfigPaths()
    ],
    build: {
      chunkSizeWarningLimit: 1e3,
      sourcemap: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || "";
            const ext = name.split(".").pop();
            if (/\.css$/.test(name)) return `css/[name]-[hash].${ext}`;
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) return `images/[name]-[hash].${ext}`;
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) return `fonts/[name]-[hash].${ext}`;
            return `assets/[name]-[hash].${ext}`;
          }
          // manualChunks: { ... } // Add if you want custom chunk splitting
        }
      },
      // Only drop console/debugger in production
      ...mode === "production" && {
        esbuild: {
          drop: ["console", "debugger"],
          pure: ["console.log", "console.info", "console.debug", "console.warn"]
        }
      }
      // No need to set build.target unless you need to support older browsers
      // target: 'baseline-widely-available', // This is now the default
    },
    optimizeDeps: {
      include: ["@mui/material/Tooltip", "react", "react-dom", "react-router-dom"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvcHJvamVjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcHJvamVjdC92aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcHJvamVjdC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQganNjb25maWdQYXRocyBmcm9tICd2aXRlLWpzY29uZmlnLXBhdGhzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBjb25zdCBBUElfVVJMID0gZW52LlZJVEVfQVBQX0JBU0VfTkFNRSB8fCAnLyc7XG4gIGNvbnN0IFBPUlQgPSAzMDAwO1xuXG4gIHJldHVybiB7XG4gICAgYmFzZTogQVBJX1VSTCxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBwb3J0OiBQT1JULFxuICAgICAgaG9zdDogdHJ1ZVxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIGhvc3Q6IHRydWVcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgZ2xvYmFsOiAnd2luZG93J1xuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0BhbnQtZGVzaWduL2ljb25zJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9AYW50LWRlc2lnbi9pY29ucycpXG4gICAgICAgIC8vIEFkZCBtb3JlIGFsaWFzZXMgYXMgbmVlZGVkXG4gICAgICB9XG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAganNjb25maWdQYXRocygpLFxuICAgIF0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gYXNzZXRJbmZvLm5hbWUgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBleHQgPSBuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICBpZiAoL1xcLmNzcyQvLnRlc3QobmFtZSkpIHJldHVybiBgY3NzL1tuYW1lXS1baGFzaF0uJHtleHR9YDtcbiAgICAgICAgICAgIGlmICgvXFwuKHBuZ3xqcGU/Z3xnaWZ8c3ZnfHdlYnB8aWNvKSQvLnRlc3QobmFtZSkpIHJldHVybiBgaW1hZ2VzL1tuYW1lXS1baGFzaF0uJHtleHR9YDtcbiAgICAgICAgICAgIGlmICgvXFwuKHdvZmYyP3xlb3R8dHRmfG90ZikkLy50ZXN0KG5hbWUpKSByZXR1cm4gYGZvbnRzL1tuYW1lXS1baGFzaF0uJHtleHR9YDtcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tuYW1lXS1baGFzaF0uJHtleHR9YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbWFudWFsQ2h1bmtzOiB7IC4uLiB9IC8vIEFkZCBpZiB5b3Ugd2FudCBjdXN0b20gY2h1bmsgc3BsaXR0aW5nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBPbmx5IGRyb3AgY29uc29sZS9kZWJ1Z2dlciBpbiBwcm9kdWN0aW9uXG4gICAgICAuLi4obW9kZSA9PT0gJ3Byb2R1Y3Rpb24nICYmIHtcbiAgICAgICAgZXNidWlsZDoge1xuICAgICAgICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICAgICAgICAgIHB1cmU6IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS5pbmZvJywgJ2NvbnNvbGUuZGVidWcnLCAnY29uc29sZS53YXJuJ11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vIE5vIG5lZWQgdG8gc2V0IGJ1aWxkLnRhcmdldCB1bmxlc3MgeW91IG5lZWQgdG8gc3VwcG9ydCBvbGRlciBicm93c2Vyc1xuICAgICAgLy8gdGFyZ2V0OiAnYmFzZWxpbmUtd2lkZWx5LWF2YWlsYWJsZScsIC8vIFRoaXMgaXMgbm93IHRoZSBkZWZhdWx0XG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsnQG11aS9tYXRlcmlhbC9Ub29sdGlwJywgJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ11cbiAgICB9XG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMk4sU0FBUyxjQUFjLGVBQWU7QUFDalEsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsUUFBTSxVQUFVLElBQUksc0JBQXNCO0FBQzFDLFFBQU0sT0FBTztBQUViLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLHFCQUFxQixLQUFLLFFBQVEsa0NBQVcsZ0NBQWdDO0FBQUE7QUFBQSxNQUUvRTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFBQSxJQUNoQjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsdUJBQXVCO0FBQUEsTUFDdkIsV0FBVztBQUFBLE1BQ1gsY0FBYztBQUFBLE1BQ2QsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixrQkFBTSxPQUFPLFVBQVUsUUFBUTtBQUMvQixrQkFBTSxNQUFNLEtBQUssTUFBTSxHQUFHLEVBQUUsSUFBSTtBQUNoQyxnQkFBSSxTQUFTLEtBQUssSUFBSSxFQUFHLFFBQU8scUJBQXFCLEdBQUc7QUFDeEQsZ0JBQUksa0NBQWtDLEtBQUssSUFBSSxFQUFHLFFBQU8sd0JBQXdCLEdBQUc7QUFDcEYsZ0JBQUksMEJBQTBCLEtBQUssSUFBSSxFQUFHLFFBQU8sdUJBQXVCLEdBQUc7QUFDM0UsbUJBQU8sd0JBQXdCLEdBQUc7QUFBQSxVQUNwQztBQUFBO0FBQUEsUUFFRjtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsR0FBSSxTQUFTLGdCQUFnQjtBQUFBLFFBQzNCLFNBQVM7QUFBQSxVQUNQLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxVQUM1QixNQUFNLENBQUMsZUFBZSxnQkFBZ0IsaUJBQWlCLGNBQWM7QUFBQSxRQUN2RTtBQUFBLE1BQ0Y7QUFBQTtBQUFBO0FBQUEsSUFHRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLHlCQUF5QixTQUFTLGFBQWEsa0JBQWtCO0FBQUEsSUFDN0U7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
