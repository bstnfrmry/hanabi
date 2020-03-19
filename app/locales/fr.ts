import { locales } from "./en";

export const fr: locales = {
  app: {
    name: "Hanabi"
  },

  screens: {
    home: {
      tagline: "Joue à Hanabi en ligne avec tes amis !",
      buttons: {
        createGame: "Créer une partie",
        passAndPlay: "Passe et joue",
        joinGame: "Rejoindre une partie",
        joinLastGame: "Rejoindre la dernière partie"
      }
    },

    createGame: {
      title:
        "Tu pourras jouer en ligne en partageant le lien de la partie à tes amis.",
      playersCount: "{{count}} joueurs",
      multicolor: "Multicolores",
      createGame: "Nouvelle partie"
    },

    play: {
      joinGame: "Rejoindre la partie",
      shareCode: "Partager le code {{gameId}}"
    }
  }
};
