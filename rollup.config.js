import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "index.js",
  output: [
    // ESM 输出配置
    {
      file: "dist/guide-anime.es.mjs",
      format: "es",
      name: "Guide",
      exports: "default",
    },
    // CommonJS 输出配置
    {
      file: "dist/guide-anime.cjs.js",
      format: "cjs",
      exports: "default",
    },
    // UMD 输出配置
    {
      file: "dist/guide-anime.umd.js",
      format: "umd",
      name: "Guide",
    },
  ],
  plugins: [
    resolve(), // 这样 Rollup 能找到 `ms`
    commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
    babel({
      externalHelpers: true,
      exclude: "node_modules/**",
    }),
    // terser(), // 压缩代码
  ],
};
