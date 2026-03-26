import fs from "fs";
import https from "https";
import path from "path";

import express from "express";
import { App, HttpPlugin, IPlugin } from "@microsoft/teams.apps";
import { ConsoleLogger } from "@microsoft/teams.common/logging";
import { DevtoolsPlugin } from "@microsoft/teams.dev";
import { createIssueRoutes } from "./routes/issues";
import { createSprintRoutes } from "./routes/sprints";

const sslOptions = {
  key: process.env.SSL_KEY_FILE ? fs.readFileSync(process.env.SSL_KEY_FILE) : undefined,
  cert: process.env.SSL_CRT_FILE ? fs.readFileSync(process.env.SSL_CRT_FILE) : undefined,
};
const plugins: IPlugin[] = [new DevtoolsPlugin()];
if (sslOptions.cert && sslOptions.key) {
  plugins.push(new HttpPlugin(https.createServer(sslOptions)));
}
const app = new App({
  logger: new ConsoleLogger("tab", { level: "debug" }),
  plugins: plugins,
});

app.tab("home", path.join(__dirname, "./client"));

app.http.get("/", (_req, res) => res.redirect("/tabs/home"));

app.http.use("/api", express.json());
createIssueRoutes(app.http as any);
createSprintRoutes(app.http as any);

(async () => {
  await app.start(+(process.env.PORT || 3978));
})();
