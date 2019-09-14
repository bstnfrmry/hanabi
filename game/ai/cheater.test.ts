import { groupBy, mapValues, range } from "lodash";

import { emptyPlayer, getScore, joinGame, newGame } from "~/game/actions";
import play from "~/game/ai/cheater";
import { IGameHintsLevel, IGameStatus } from "~/game/state";

test("how many games can be completed", () => {
  const games = range(0, 100).map(i => {
    let game = newGame({
      id: "test",
      playersCount: 2,
      multicolor: true,
      allowRollback: false,
      preventLoss: false,
      seed: `${i}`,
      private: true,
      hintsLevel: IGameHintsLevel.NONE,
      botsWait: 1000,
      turnsHistory: false
    });

    game = joinGame(game, emptyPlayer("1", "P1"));
    game = joinGame(game, emptyPlayer("2", "P2"));
    game = joinGame(game, emptyPlayer("3", "P3"));

    while (game.status !== IGameStatus.OVER) {
      game = play(game);
    }

    return game;
  });

  const stats = mapValues(
    groupBy(games, game => getScore(game)),
    games => games.length
  );

  console.log(stats);
});
