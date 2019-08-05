export interface IGameState {
  playedCards: ICard[];
  drawPile: ICard[];
  discardPile: ICard[];
  players: IPlayer[];
  tokens: ITokens;
  lastAction?: IAction;
  currentPlayer: number;
  options: IGameOptions;
}

export interface IGameOptions {
  playersCount: number;
  multicolor: boolean;
}

export enum C {
  RED = 1,
  GREEN,
  BLUE,
  WHITE,
  YELLOW,
  MULTICOLOR
}

// an array of true (still possible) or false (impossible)
// e.g. a hint onto an unknown card turns all but one values to false
// it's something public, i.e. information that has been given
// to all players
export interface ICardHint {
  color: boolean[];
  number: boolean[];
}

export type IHand = IHandCard[];

export interface ICard {
  color: C;
  number: number;
}

export interface IHandCard extends ICard {
  hint: ICardHint;
}

export interface IAction {
  from: number;
  to: number;
  type: "color" | "number";
  value: C | number;
}

export interface IPlayer {
  hand: IHand;
  name: string;
  id: number;
  lastAction?: IAction;
}

// the remaining strikes and hints
export interface ITokens {
  hints: number;
  strikes: number;
}

export type gameHistory = IGameState[];

export const sampleState: IGameState = {
  playedCards: [{ color: C.RED, number: 1 }],
  drawPile: [{ color: C.YELLOW, number: 2 }, { color: C.BLUE, number: 4 }],
  discardPile: [],
  players: [
    {
      name: "Akiyo",
      id: 0,
      hand: [
        {
          color: C.MULTICOLOR,
          number: 3,
          hint: {
            color: [false, false, true, true, true, true],
            number: [false, false, true, false, false]
          }
        },
        {
          color: C.BLUE,
          number: 2,
          hint: {
            color: [true, true, true, true, true, true],
            number: [true, true, true, true, true, true]
          }
        },
        {
          color: C.RED,
          number: 4,
          hint: {
            color: [true, true, true, true, true, true],
            number: [true, true, true, true, true, true]
          }
        },
        {
          color: C.RED,
          number: 4,
          hint: {
            color: [true, true, true, true, true, true],
            number: [true, true, true, true, true, true]
          }
        },
        {
          color: C.WHITE,
          number: 3,
          hint: {
            color: [false, false, true, true, true, true],
            number: [false, false, true, false, false]
          }
        }
      ]
    },
    {
      name: "Miho",
      id: 1,
      hand: [
        {
          color: C.BLUE,
          number: 1,
          hint: {
            color: [true, false, true, true, true, true],
            number: [true, false, true, false, false]
          }
        },
        {
          color: C.BLUE,
          number: 2,
          hint: {
            color: [true, true, true, true, true, true],
            number: [true, true, true, true, true, true]
          }
        },
        {
          color: C.WHITE,
          number: 1,
          hint: {
            color: [true, true, true, true, true, true],
            number: [true, true, true, true, true, true]
          }
        },
        {
          color: C.RED,
          number: 2,
          hint: {
            color: [true, true, true, true, true, true],
            number: [true, true, true, true, true, true]
          }
        },
        {
          color: C.GREEN,
          number: 2,
          hint: {
            color: [false, true, true, true, true, true],
            number: [false, true, true, false, false]
          }
        }
      ]
    }
  ],
  tokens: {
    hints: 4,
    strikes: 3
  },
  currentPlayer: 1,
  options: {
    playersCount: 2,
    multicolor: true
  }
};
