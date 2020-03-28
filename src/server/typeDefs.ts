import { gql } from "apollo-server";

export const typeDefs = gql`
  type GameOptions {
    playersCount: Int!
    multicolor: Boolean!
  }

  type Game {
    id: String!
    options: GameOptions!
    state: GameState!
  }

  type GameState {
    players: [Player!]!
    playedCards: [Card!]!
    drawPile: [Card!]!
    discardPile: [Card!]!
    currentPlayer: Int!
  }

  type Player {
    id: String!
    name: String!
    bot: Boolean!
    hand: [Card!]!
  }

  enum Color {
    RED
    GREEN
    BLUE
    WHITE
    YELLOW
    MULTICOLOR
  }

  type Card {
    color: String!
    number: Int!
  }

  type Tokens {
    hints: Int!
    strikes: Int!
  }

  input CreateGameInput {
    playersCount: Int!
    multicolor: Boolean!
  }

  input JoinGameInput {
    name: String!
    bot: Boolean!
  }

  input DiscardActionInput {
    from: Int!
    cardIndex: Int!
  }

  input PlayActionInput {
    from: Int!
    cardIndex: Int!
  }

  input ColorHintActionInput {
    from: Int!
    to: Int!
    value: String!
  }

  input NumberHintActionInput {
    from: Int!
    to: Int!
    value: Int!
  }

  type Query {
    game(gameId: ID!): Game
  }

  type Mutation {
    createGame(input: CreateGameInput!): Game
    joinGame(gameId: ID!, input: JoinGameInput!): Game

    playCard(gameId: ID!, input: PlayActionInput!): Game
    discardCard(gameId: ID!, input: DiscardActionInput!): Game
    hintColor(gameId: ID!, input: ColorHintActionInput!): Game
    hintNumber(gameId: ID!, input: NumberHintActionInput!): Game
  }

  type Subscription {
    gameStateChanged(gameId: ID!): Game
  }
`;
