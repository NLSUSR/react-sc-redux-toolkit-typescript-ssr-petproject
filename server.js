import compression from "compression";
import express from "express";
import { readFileSync } from "fs";
import { resolve } from "path";
import serveStatic from "serve-static";
import { render } from "./dist/server/entry-server.js";

((http) => {
  http.listen(80, () => {
    http
      .use(compression(), serveStatic(resolve("dist/client"), { index: false }))
      .use("*", async (req, res, next) => {
        try {
          res
            .status(200)
            .set({ "Content-Type": "text/html" })
            .end(
              readFileSync(resolve("dist/client/index.html"), "utf-8").replace(
                "<!--app-html-->",
                render(req.originalUrl)
              )
            );
        } catch (error) {
          next(error);
        }
      });
  });
})(express());
