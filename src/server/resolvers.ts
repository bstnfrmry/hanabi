import { PubSub, withFilter } from "apollo-server";
import knex from "knex";

import {
  Game,
  MutationCreateGameArgs,
  MutationDiscardCardArgs,
  MutationHintColorArgs,
  MutationHintNumberArgs,
  MutationJoinGameArgs,
  MutationPlayCardArgs,
  QueryGameArgs,
  SubscriptionGameStateChangedArgs
} from "~/generated/graphql";

import { commitAction, joinGame, newGame } from "../game/actions";
import { GameMode, IColor, IGameHintsLevel, INumber } from "../game/state";

const db = knex({
  client: "pg",
  connection: "postgresql://postgres@localhost:5432/hanabi"
});

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    async game(parent, args: QueryGameArgs) {
      const game = await db("games")
        .where({ id: args.gameId })
        .first();

      return game;
    }
  },

  Mutation: {
    async createGame(parent, args: MutationCreateGameArgs) {
      const state = newGame({
        allowRollback: true,
        preventLoss: false,
        seed: "1234",
        private: true,
        hintsLevel: IGameHintsLevel.ALL,
        turnsHistory: true,
        botsWait: 300,
        gameMode: GameMode.NETWORK,
        ...args.input
      });

      const [game] = await db("games")
        .returning("*")
        .insert({
          options: args.input,
          state
        });

      return game;
    },

    async joinGame(parent, args: MutationJoinGameArgs) {
      const game = await db("games")
        .where({ id: args.gameId })
        .first();

      game.state = joinGame(game.state, {
        id: `${+new Date()}`,
        ...args.input
      });

      await db("games")
        .where({ id: game.id })
        .update({ state: game.state });

      pubsub.publish("gameStateChanged", game);

      return game;
    },

    async playCard(parent, args: MutationPlayCardArgs) {
      const game = await db("games")
        .where({ id: args.gameId })
        .first();

      game.state = commitAction(game.state, {
        action: "play",
        ...args.input
      });

      await db("games")
        .where({ id: game.id })
        .update({ state: game.state });

      pubsub.publish("gameStateChanged", game);

      return game;
    },

    async discardCard(parent, args: MutationDiscardCardArgs) {
      const game = await db("games")
        .where({ id: args.gameId })
        .first();

      game.state = commitAction(game.state, {
        action: "discard",
        ...args.input
      });

      await db("games")
        .where({ id: game.id })
        .update({ state: game.state });

      pubsub.publish("gameStateChanged", game);

      return game;
    },

    async hintColor(parent, args: MutationHintColorArgs) {
      const game = await db("games")
        .where({ id: args.gameId })
        .first();

      game.state = commitAction(game.state, {
        action: "hint",
        type: "color",
        from: args.input.from,
        to: args.input.to,
        value: args.input.value as IColor
      });

      await db("games")
        .where({ id: game.id })
        .update({ state: game.state });

      pubsub.publish("gameStateChanged", game);

      return game;
    },

    async hintNumber(parent, args: MutationHintNumberArgs) {
      const game = await db("games")
        .where({ id: args.gameId })
        .first();

      game.state = commitAction(game.state, {
        action: "hint",
        type: "color",
        from: args.input.from,
        to: args.input.to,
        value: args.input.value as INumber
      });

      await db("games")
        .where({ id: game.id })
        .update({ state: game.state });

      pubsub.publish("gameStateChanged", game);

      return game;
    }
  },

  Subscription: {
    gameStateChanged: {
      resolve: (game: Game) => game,
      subscribe: withFilter(
        () => pubsub.asyncIterator("gameStateChanged"),
        (game: Game, args: SubscriptionGameStateChangedArgs) => {
          return game.id == args.gameId;
        }
      )
    }
  }
};
