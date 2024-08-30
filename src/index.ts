import "reflect-metadata";

import express from "express";
import { application } from "./common/config/constants";
import router from "./router";
import database from "./common/config/database";

async function main() {
  try {
    await database.initialize();

    const app = express();

    app.use(express.json({ limit: "1mb" }));
    app.use(express.json());
    app.use(router);

    app.listen(application.port, () =>
      console.log(`The server is running on port ${application.port}`)
    );
  } catch (e) {
    console.error((e as Error).message);
  }
}

main();
