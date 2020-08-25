import { isGameOver, joinGame, newGame } from "./actions";
import { play } from "./ai";
import { GameMode, GameVariant, IGameHintsLevel, IGameOptions, IPlayer } from "./state";

const scoresDistribution = {};

const options: IGameOptions = {
  id: "benchmark",
  playersCount: 3,
  variant: GameVariant.CLASSIC,
  allowRollback: false,
  private: false,
  preventLoss: false,
  seed: Math.random().toString(),
  hintsLevel: IGameHintsLevel.ALL,
  botsWait: 0,
  gameMode: GameMode.NETWORK,
  turnsHistory: false,
  colorBlindMode: false,
};

const defaultPlayer: IPlayer = {
  id: Math.random.toString(),
  name: "name",
  bot: true,
};

for (let i = 0; i < 1000; i++) {
  let game = newGame({ ...options, seed: Math.random().toString() });
  for (let i = 0; i < options.playersCount; i++) {
    game = joinGame(game, { ...defaultPlayer });
  }
  while (!isGameOver(game)) {
    game = play(game);
  }
  if (!scoresDistribution[game.playedCards.length]) {
    scoresDistribution[game.playedCards.length] = 0;
  }

  scoresDistribution[game.playedCards.length] += 1;
}

console.log(scoresDistribution);
