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
        joinGame: "Join game"
      }
    },

    createGame: {
      title:
        "You will be able to play online by sharing the game link to your friends.",
      playersCount: "{{count}} players"
    }
  }
};

export type locales = typeof en;
