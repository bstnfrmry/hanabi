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

export enum IColor {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
  WHITE = "white",
  YELLOW = "yellow",
  MULTICOLOR = "multicolor"
}

export type INumber = 1 | 2 | 3 | 4 | 5;

// an array of 2 (direct hint), 1 (still possible), or 0 (impossible)
// e.g. a color hint onto an card turns all but one values to 0, and one value to 2.
// a color hint onto a card give all the other cards in the hand a 0 for that color.
// it's something public, i.e. information that has been given
// to all players
export interface ICardHint {
  color: { [key in IColor]: (0 | 1 | 2) };
  number: { [key in 1 | 2 | 3 | 4 | 5]: (0 | 1 | 2) };
}

export type IHand = IHandCard[];

export interface ICard {
  color: IColor;
  number: number;
}

export interface IHandCard extends ICard {
  hint: ICardHint;
}

export type IActionType = "discard" | "play" | "hint";

export interface IDiscardAction {
  action: "discard";
  card: IHandCard;
  // do we need to know where that card was placed in the hand?
}

export interface IPlayAction {
  action: "play";
  card: IHandCard;
}

export interface IHintAction {
  action: "hint";
  from: number;
  to: number;
  type: "color" | "number";
  value: IColor | INumber;
}

export type IAction = IDiscardAction | IPlayAction | IHintAction;

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
  playedCards: [{ color: IColor.RED, number: 1 }],
  drawPile: [
    { color: IColor.YELLOW, number: 2 },
    { color: IColor.BLUE, number: 4 }
  ],
  discardPile: [],
  players: [
    {
      name: "Akiyo",
      id: 0,
      hand: [
        {
          color: IColor.MULTICOLOR,
          number: 3,
          hint: {
            color: {
              red: 0,
              blue: 0,
              yellow: 0,
              white: 0,
              green: 0,
              multicolor: 2
            },
            number: {
              1: 1,
              2: 0,
              3: 1,
              4: 0,
              5: 1
            }
          }
        },
        {
          color: IColor.BLUE,
          number: 2,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 1,
              green: 1,
              multicolor: 0
            },
            number: {
              1: 0,
              2: 2,
              3: 0,
              4: 0,
              5: 0
            }
          }
        },
        {
          color: IColor.RED,
          number: 4,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 1,
              green: 1,
              multicolor: 1
            },
            number: {
              1: 1,
              2: 1,
              3: 1,
              4: 1,
              5: 1
            }
          }
        },
        {
          color: IColor.RED,
          number: 4,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 1,
              green: 1,
              multicolor: 1
            },
            number: {
              1: 1,
              2: 1,
              3: 1,
              4: 1,
              5: 1
            }
          }
        },
        {
          color: IColor.WHITE,
          number: 3,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 1,
              green: 1,
              multicolor: 1
            },
            number: {
              1: 1,
              2: 1,
              3: 1,
              4: 1,
              5: 1
            }
          }
        }
      ]
    },
    {
      name: "Miho",
      id: 1,
      hand: [
        {
          color: IColor.BLUE,
          number: 1,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 0,
              green: 0,
              multicolor: 0
            },
            number: {
              1: 1,
              2: 1,
              3: 0,
              4: 0,
              5: 1
            }
          }
        },
        {
          color: IColor.BLUE,
          number: 2,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 0,
              white: 1,
              green: 1,
              multicolor: 1
            },
            number: {
              1: 1,
              2: 1,
              3: 1,
              4: 0,
              5: 1
            }
          }
        },
        {
          color: IColor.WHITE,
          number: 1,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 1,
              green: 1,
              multicolor: 0
            },
            number: {
              1: 2,
              2: 0,
              3: 0,
              4: 0,
              5: 0
            }
          }
        },
        {
          color: IColor.RED,
          number: 2,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 1,
              green: 1,
              multicolor: 1
            },
            number: {
              1: 1,
              2: 1,
              3: 1,
              4: 1,
              5: 1
            }
          }
        },
        {
          color: IColor.GREEN,
          number: 2,
          hint: {
            color: {
              red: 1,
              blue: 1,
              yellow: 1,
              white: 1,
              green: 1,
              multicolor: 1
            },
            number: {
              1: 1,
              2: 1,
              3: 1,
              4: 1,
              5: 1
            }
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
