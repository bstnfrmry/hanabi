import json from "big-json";
import { program } from "commander";
import fs from "fs";
import { omit } from "lodash";
import { Sequelize } from "sequelize";

import { getMaximumPossibleScore, getScore } from "../src/lib/actions";
import IGameState, { rebuildGame } from "../src/lib/state";

interface Database {
  games: Array<{
    id: string;
    options: object;
  }>;
}

const sequelize = new Sequelize("postgres://postgres@localhost:5432/hanabi", {
  logging: false,
});

program
  .name("convert-database")
  .option("-p, --path <path>", "Path of the JSON database dump")
  .action(async ({ path }) => {
    await sequelize.authenticate();

    const db = await new Promise<Database>(resolve => {
      const readStream = fs.createReadStream(path, { flags: "r", encoding: "utf-8" });
      const parseStream = json.createParseStream();

      readStream.pipe(parseStream);

      parseStream.on("data", (db: Database) => {
        resolve(db);
      });
    });

    await Promise.all(
      Object.values(db.games as Partial<IGameState>[]).map(async game => {
        const id = game.id;
        const options = JSON.stringify(game.options);
        const state = JSON.stringify(omit(game, ["id", "options", "history"]));
        const fullState = rebuildGame(game as Partial<IGameState>);

        const score = getScore(fullState);
        const maxPossibleScore = getMaximumPossibleScore(fullState);
        const playersCount = fullState.players.length;
        const variant = fullState.options.variant;
        const colorblindMode = fullState.options.colorBlindMode ?? false;
        const messagesCount = fullState.messages?.length ?? 0;

        await sequelize.query(`
          INSERT INTO "games"
            ("id", "options", "state", "full_state", "score", "max_possible_score", "players_count", "variant", "colorblind_mode", "messages_count")
          VALUES
            ('${id}', '${options}', '${state}', '${fullState}', ${score}, ${maxPossibleScore}, ${playersCount}, '${variant}', ${colorblindMode}, ${messagesCount})
          ON CONFLICT DO NOTHING
        `);

        console.log(`Inserted game ${id}`);
      })
    );
  })
  .parse(process.argv);
