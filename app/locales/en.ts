import play from "../game/ai";

export const en = {
  app: {
    name: "Hanabi"
  },

  screens: {
    home: {
      tagline: "Play the Hanabi game online with friends!",
      buttons: {
        createGame: "Create game",
        passAndPlay: "Pass and play",
        joinGame: "Join game",
        joinLastGame: "Rejoin current game"
      }
    },

    createGame: {
      title:
        "You will be able to play online by sharing the game link to your friends.",
      playersCount: "{{count}} players",
      multicolor: "Use multicolors",
      createGame: "New game"
    },

    play: {
      joinGame: "Join game",
      shareCode: "Share this code {{gameId}}",
      addBot: "Ajouter une IA",
      startGame: "Start game"
    },

    joinGame: {
      title: "Join game"
    }
  }
};

export type locales = typeof en;
