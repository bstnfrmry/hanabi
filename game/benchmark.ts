import { isGameOver, joinGame, newGame } from "./actions";
import play from "./ai";
import { GameMode, IGameHintsLevel, IGameOptions, IPlayer } from "./state";

const scoresDistribution = { 2: {}, 3: {}, 4: {}, 5: {} };

let seed = 1;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const options: IGameOptions = {
  id: "benchmark",
  playersCount: 4,
  multicolor: true,
  allowRollback: false,
  private: false,
  preventLoss: false,
  seed: random().toString(),
  hintsLevel: IGameHintsLevel.ALL,
  botsWait: 0,
  gameMode: GameMode.NETWORK,
  turnsHistory: false
};

const defaultPlayer: IPlayer = {
  id: random().toString(),
  name: "name",
  bot: true
};

for (let i = 0; i < 1000; i++) {
  const seed = Math.random().toString();
  for (let p = 2; p <= 5; p++) {
    let game = newGame({ ...options, playersCount: p, seed });
    for (let i = 0; i < p; i++) {
      game = joinGame(game, { ...defaultPlayer });
    }
    while (!isGameOver(game)) {
      game = play(game);
    }

    if (!scoresDistribution[p][game.playedCards.length]) {
      scoresDistribution[p][game.playedCards.length] = 0;
    }

    scoresDistribution[p][game.playedCards.length] += 1;
  }
}

console.log(scoresDistribution);
