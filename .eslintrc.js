// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  ignorePatterns: [
    "src/components/ui/**",
    "src/components/AppSidebar.tsx",
    "src/components/BottomTabs.tsx",
    "src/components/NavLink.tsx",
    "src/hooks/**",
    "src/lib/**",
    "src/pages/Index.tsx",
    "src/pages/NotFound.tsx",
    "src/test/**",
    "src/main.tsx",
    "src/App.css",
    "src/index.css",
    "src/vite-env.d.ts",
    "index.html",
    "vite.config.ts",
    "vitest.config.ts",
    "tailwind.config.ts",
    "postcss.config.js",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "components.json"
  ],
};
