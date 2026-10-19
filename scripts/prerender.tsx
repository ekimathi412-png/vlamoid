import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import Home from "../client/src/pages/Home";

const path = new URL("../dist/public/index.html", import.meta.url);
const template = readFileSync(path, "utf8");
const body = renderToString(<Home />);
if (!template.includes('<div id="root"></div>')) {
  throw new Error(
    "Static-rendering mount marker was not found in the Vite output."
  );
}
writeFileSync(
  path,
  template.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
);
console.log("Vlamoid home page rendered as complete static HTML.");
