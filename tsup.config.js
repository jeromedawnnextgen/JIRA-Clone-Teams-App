/**
 * @type {import('tsup').Options}
 */
module.exports = {
  dts: false,
  minify: false,
  bundle: false,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  clean: true,
  outDir: "dist",
  format: ["cjs", "esm"],
  entry: ["src/index.ts", "src/store.ts", "src/routes/issues.ts", "src/routes/sprints.ts"],
  tsconfig: "tsconfig.node.json",
};
