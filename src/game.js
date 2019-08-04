require("colors");

const {
  flatten,
  flatMap,
  groupBy,
  last,
  padEnd,
  sumBy,
  without
} = require("lodash");
const { shuffle } = require("shuffle-seed");

const Color = {
  BLUE: "blue",
  WHITE: "white",
  RED: "red",
  YELLOW: "yellow",
  GREEN: "green",
  MULTICOLOR: "multicolor"
};

const Hint = {
  COLOR: "color",
  VALUE: "value"
};

const Values = [1, 2, 3, 4, 5];

const StartingHandSize = {
  2: 5,
  3: 5,
  4: 4,
  5: 4
};

const NOTE_TOKENS = 8;

const STORM_TOKENS = 3;

function colorValue(color, value, knowledge = {}) {
  let string = `${value}`;

  string = color === Color.MULTICOLOR ? string.cyan : string[color];

  if (knowledge.full) {
    string = string.inverse;
  } else if (knowledge.value) {
    string = string.underline;
  } else if (knowledge.color) {
    string = string.italic;
  }

  return string;
}

class Card {
  constructor(color, value) {
    this.color = color;
    this.value = value;
    this.guesses = [];
    this.age = null;
    this.ageInDiscardPile = null;
    this.knowledge = new CardKnowledge();
  }

  get text() {
    return colorValue(this.color, this.value, this.knowledge);
  }
}

class CardKnowledge {
  constructor() {
    this.color = false;
    this.value = false;
  }

  get none() {
    return !this.color && !this.value;
  }

  get full() {
    return this.color && this.value;
  }

  get partial() {
    return !this.none && !this.full;
  }
}

class Player {
  constructor(game, options) {
    this.game = game;
    this.name = options.name;
    this.hand = [];
    this.receivedHints = [];
    this.onPlay = options.onPlay;
  }

  get teammates() {
    const position = this.game.players.indexOf(this);

    return [
      // Put next players first in the list
      ...this.game.players.slice(position + 1),
      ...this.game.players.slice(0, position)
    ];
  }

  get nextTeammate() {
    return this.teammates[0];
  }

  get previousTeammate() {
    return last(this.teammates);
  }

  get lastReceivedHint() {
    return last(this.receivedHints);
  }

  play(card) {
    this.ensureCardIsInHand(card);

    this.game.log(`# Player ${this.name} played ${card.text}`);

    // Remove card from hand
    this.hand.splice(this.hand.indexOf(card), 1);

    // Handle when card is not playable
    if (!this.game.canPlay(card)) {
      // Add card to discarded cards pile
      this.game.discardPile[card.color].push(card);

      // Consume a storm token
      this.game.remainingStormTokens -= 1;
    } else {
      // Add card to board
      this.game.board[card.color].push(card);

      // Get a note token for the last card on a pile
      if (card.value === 5) {
        this.game.remainingNoteTokens += 1;
      }
    }

    this.draw();
  }

  discard(card) {
    this.ensureCardIsInHand(card);

    this.game.log(`# Player ${this.name} discarded ${card.text}`);

    // Remove card from hand
    this.hand.splice(this.hand.indexOf(card), 1);

    // Move card to discarded cards pile
    this.game.discardPile[card.color].push(card);

    // Earn note token
    this.game.remainingNoteTokens += 1;

    this.draw();
  }

  hintColor(player, color) {
    this.ensureHintsRemaining();
    this.ensurePlayerIsTeammate(player);

    this.game.log(
      `# Player ${this.name} gave ${color} color hint to ${player.name}`
    );

    const cards = player.hand.filter(card => card.color === color);

    player.receivedHints.push({
      player: this,
      cards,
      hint: Hint.COLOR,
      color,
      positions: cards.map(card => player.hand.indexOf(card))
    });

    cards.forEach(card => {
      card.knowledge.color = true;
    });

    this.game.remainingNoteTokens -= 1;
  }

  hintValue(player, value) {
    this.ensureHintsRemaining();
    this.ensurePlayerIsTeammate(player);

    this.game.log(
      `# Player ${this.name} gave ${value} value hint to ${player.name}`
    );

    const cards = player.hand.filter(card => card.value === value);

    cards.forEach(card => {
      card.knowledge.value = true;
    });

    player.receivedHints.push({
      player: this,
      cards,
      hint: Hint.VALUE,
      value,
      positions: cards.map(card => player.hand.indexOf(card))
    });

    this.game.remainingNoteTokens -= 1;
  }

  ensureCardIsInHand(card) {
    if (this.hand.indexOf(card) === -1) {
      throw new Error("Card is not in hand");
    }
  }

  ensureHintsRemaining() {
    if (!this.game.remainingNoteTokens) {
      throw new Error("No remaining note tokens");
    }
  }

  ensurePlayerIsTeammate(player) {
    if (player === this || this.game.players.indexOf(player) === -1) {
      throw new Error("Player is not a teammate");
    }
  }

  guess(card) {
    let remainingCards = without(
      this.game.cards,
      // All cards in the discard pile
      ...flatten(Object.values(this.game.discardPile)),
      // All cards on the board
      ...flatten(Object.values(this.game.board)),
      // Cards in my teammates hand
      ...flatMap(this.teammates, teammate => teammate.hand),
      // Card in my hand that I know
      ...this.hand.filter(item => item !== card && item.knowledge.full)
    );

    if (card.knowledge.color) {
      remainingCards = remainingCards.filter(item => item.color === card.color);
    }
    if (card.knowledge.value) {
      remainingCards = remainingCards.filter(item => item.value === card.value);
    }

    return remainingCards;
  }

  get unknownCards() {
    return [
      ...this.game.deck,
      ...this.hand.filter(card => !card.knowledge.full)
    ];
  }

  draw() {
    if (!this.game.deck.length) {
      return;
    }

    const card = this.game.deck.splice(0, 1)[0];
    card.age = 0;

    this.hand.push(card);
    this.game.log(`# Player ${this.name} drew ${card.text}`);

    if (!this.game.deck.length) {
      this.game.log("# Last turn started");
      this.game.lastTurn = true;
      this.turnsRemaining = 1;
    }
  }
}

class Game {
  constructor(options) {
    // Ensure that game has enough players
    if (options.players.length < 2 || options.players.length > 5) {
      throw new Error("Game must have between 2 and 5 players");
    }

    // Initialize options
    this.extension = options.extension || false;
    this.logging = options.logging || false;
    this.seed = options.seed || +new Date() * Math.random();

    this.turn = 0;
    this.lastTurn = false;

    // Initialize players
    this.players = options.players.map(
      playerOptions => new Player(this, playerOptions)
    );

    // Initialize tokens
    this.remainingNoteTokens = NOTE_TOKENS;
    this.remainingStormTokens = STORM_TOKENS;

    // Initialize board
    this.board = {};
    Object.keys(Color).forEach(color => (this.board[Color[color]] = []));

    // Initialize discard pile
    this.discardPile = {};
    Object.keys(Color).forEach(color => (this.discardPile[Color[color]] = []));

    // Initialize cards
    this.cards = flatMap(
      [Color.BLUE, Color.WHITE, Color.RED, Color.YELLOW, Color.GREEN],
      color => [
        new Card(color, 1),
        new Card(color, 1),
        new Card(color, 1),
        new Card(color, 2),
        new Card(color, 2),
        new Card(color, 3),
        new Card(color, 3),
        new Card(color, 4),
        new Card(color, 4),
        new Card(color, 5)
      ]
    );

    // Add extensions cards when applicable
    if (this.extension) {
      this.cards.push(
        new Card(Color.MULTICOLOR, 1),
        new Card(Color.MULTICOLOR, 2),
        new Card(Color.MULTICOLOR, 3),
        new Card(Color.MULTICOLOR, 4),
        new Card(Color.MULTICOLOR, 5)
      );
    }

    // Initialize deck
    this.deck = shuffle(this.cards, this.seed);

    // Deal initial cards
    this.players.forEach(player => {
      player.hand = this.deck.splice(0, StartingHandSize[this.players.length]);
      player.hand.forEach(card => (card.age = 0));
    });

    // Define starting player
    const [startingPlayer] = shuffle(this.players, this.seed);
    this.currentPlayerIndex = this.players.indexOf(startingPlayer);
  }

  get values() {
    return Values;
  }

  get colors() {
    return Object.values(Color);
  }

  get handSize() {
    return StartingHandSize[this.players.length];
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get score() {
    return sumBy(Object.values(this.board), pile => {
      const topCard = last(pile);

      return topCard ? topCard.value : 0;
    });
  }

  get maxScore() {
    return this.extension ? 30 : 25;
  }

  get state() {
    // All storm tokens have been used
    if (this.remainingStormTokens === 0) {
      return { over: true, reason: "STORM_TOKENS" };
    }

    if (this.currentPlayer.turnsRemaining === 0) {
      return { over: true, reason: "EMPTY_DECK" };
    }

    return { over: false };
  }

  topCard(color) {
    return last(this.board[color]);
  }

  canPlay(card) {
    const topCard = this.topCard(card.color);
    const topValue = topCard ? topCard.value : 0;

    return topValue === card.value - 1;
  }

  canDiscard(card) {
    const topCard = this.topCard(card.color);
    const topValue = topCard ? topCard.value : 0;

    return topValue >= card.value;
  }

  async play(onTick) {
    this.turn += 1;

    // Last turn for the player
    if (this.currentPlayer.turnsRemaining) {
      this.currentPlayer.turnsRemaining -= 1;
    }

    // Refresh card guesses
    this.players.forEach(player => {
      player.hand.forEach(card => (card.guesses = player.guess(card)));
    });

    const action = await this.currentPlayer.onPlay({
      player: this.currentPlayer,
      game: this
    });

    if (action.reason) {
      this.log(`* ${action.reason}`);
    }
    switch (action.type) {
      case "hint-color":
        this.currentPlayer.hintColor(action.player, action.color);
        break;
      case "hint-value":
        this.currentPlayer.hintValue(action.player, action.value);
        break;
      case "play":
        this.currentPlayer.play(action.card);
        break;
      case "discard":
        this.currentPlayer.discard(action.card);
        break;
    }

    if (this.state.over) {
      this.log(
        `# Game over - ${this.state.reason} - Score: ${this.score} / ${this.maxScore}`
      );
      this.print();
      return;
    }

    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;

    this.print();

    // Age cards in hand
    this.players.forEach(player => {
      player.hand.forEach((card, position) => {
        card.age += 1;
        if (position === 0) {
          card.ageInDiscardPile = card.ageInDiscardPile
            ? card.ageInDiscardPile + 1
            : 1;
        } else {
          card.ageInDiscardPile = null;
        }
      });
    });

    if (onTick) {
      await onTick(this);
    }

    await this.play(onTick);
  }

  print() {
    const boardPiles = Object.keys(groupBy(this.cards, card => card.color));

    this.log(
      [
        "---",
        `Turn ${this.turn} · Deck: ${this.deck.length} · Note: ${this.remainingNoteTokens} · Storm: ${this.remainingStormTokens}`,
        `Board   ${boardPiles
          .map(color => {
            const topValue = this.board[color].length
              ? last(this.board[color]).value
              : 0;
            return colorValue(color, topValue);
          })
          .join(" ")}`,
        `Discard ${flatten(Object.values(this.discardPile))
          .map(card => card.text)
          .join(" ")}`,
        ...this.players.map(player => {
          return `${padEnd(player.name, 7)} ${player.hand
            .map(card => card.text)
            .join(" ")} ${player === this.currentPlayer ? "*" : ""}`;
        }),
        "---"
      ].join("\n")
    );
  }

  log(message) {
    if (!this.logging) {
      return;
    }

    console.log(message);
  }
}

module.exports = {
  Game
};
