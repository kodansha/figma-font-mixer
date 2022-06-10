const fs = require("fs");
const esbuild = require("esbuild");

const buildHtml = () => {
  const script = fs.readFileSync("dist/ui.js", { encoding: "utf-8" });
  const output = `<html>
  <div id="app"></div>
  <script>${script}</script>
  </html>
  `;
  fs.writeFileSync("dist/ui.html", output);
};

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ["src/ui.tsx", "src/code.ts"],
  bundle: true,
  sourcemap: false,
  minify: process.env.NODE_ENV === "production",
  watch: {
    onRebuild: (error, result) => {
      if (error) console.error(error);
      else {
        console.log("success:", result);
        buildHtml();
      }
    },
  },
  outdir: "dist",
};

esbuild.build(options).then(() => {
  buildHtml();
});