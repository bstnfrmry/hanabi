import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type ColorHintActionInput = {
  from: Scalars['Int'];
  to: Scalars['Int'];
  value: Scalars['String'];
};

export type CreateGameInput = {
  playersCount: Scalars['Int'];
  multicolor: Scalars['Boolean'];
};

export type DiscardActionInput = {
  from: Scalars['Int'];
  cardIndex: Scalars['Int'];
};

export type Game = {
   __typename?: 'Game';
  id: Scalars['String'];
  options: GameOptions;
  state: GameState;
};

export type GameOptions = {
   __typename?: 'GameOptions';
  playersCount: Scalars['Int'];
  multicolor: Scalars['Boolean'];
};

export type GameState = {
   __typename?: 'GameState';
  players?: Maybe<Array<Maybe<Player>>>;
};

export type JoinGameInput = {
  name: Scalars['String'];
  bot: Scalars['Boolean'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createGame?: Maybe<Game>;
  joinGame?: Maybe<Game>;
  playCard?: Maybe<Game>;
  discardCard?: Maybe<Game>;
  hintColor?: Maybe<Game>;
  hintNumber?: Maybe<Game>;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationJoinGameArgs = {
  gameId: Scalars['ID'];
  input: JoinGameInput;
};


export type MutationPlayCardArgs = {
  gameId: Scalars['ID'];
  input: PlayActionInput;
};


export type MutationDiscardCardArgs = {
  gameId: Scalars['ID'];
  input: DiscardActionInput;
};


export type MutationHintColorArgs = {
  gameId: Scalars['ID'];
  input: ColorHintActionInput;
};


export type MutationHintNumberArgs = {
  gameId: Scalars['ID'];
  input: NumberHintActionInput;
};

export type NumberHintActionInput = {
  from: Scalars['Int'];
  to: Scalars['Int'];
  value: Scalars['Int'];
};

export type PlayActionInput = {
  from: Scalars['Int'];
  cardIndex: Scalars['Int'];
};

export type Player = {
   __typename?: 'Player';
  id: Scalars['String'];
  name: Scalars['String'];
  bot: Scalars['Boolean'];
};

export type Query = {
   __typename?: 'Query';
  game?: Maybe<Game>;
};


export type QueryGameArgs = {
  gameId: Scalars['ID'];
};

export type Subscription = {
   __typename?: 'Subscription';
  gameStateChanged?: Maybe<Game>;
};


export type SubscriptionGameStateChangedArgs = {
  gameId: Scalars['ID'];
};





export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Game: ResolverTypeWrapper<Game>,
  String: ResolverTypeWrapper<Scalars['String']>,
  GameOptions: ResolverTypeWrapper<GameOptions>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  GameState: ResolverTypeWrapper<GameState>,
  Player: ResolverTypeWrapper<Player>,
  Mutation: ResolverTypeWrapper<{}>,
  CreateGameInput: CreateGameInput,
  JoinGameInput: JoinGameInput,
  PlayActionInput: PlayActionInput,
  DiscardActionInput: DiscardActionInput,
  ColorHintActionInput: ColorHintActionInput,
  NumberHintActionInput: NumberHintActionInput,
  Subscription: ResolverTypeWrapper<{}>,
  CacheControlScope: CacheControlScope,
  Upload: ResolverTypeWrapper<Scalars['Upload']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  ID: Scalars['ID'],
  Game: Game,
  String: Scalars['String'],
  GameOptions: GameOptions,
  Int: Scalars['Int'],
  Boolean: Scalars['Boolean'],
  GameState: GameState,
  Player: Player,
  Mutation: {},
  CreateGameInput: CreateGameInput,
  JoinGameInput: JoinGameInput,
  PlayActionInput: PlayActionInput,
  DiscardActionInput: DiscardActionInput,
  ColorHintActionInput: ColorHintActionInput,
  NumberHintActionInput: NumberHintActionInput,
  Subscription: {},
  CacheControlScope: CacheControlScope,
  Upload: Scalars['Upload'],
};

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  options?: Resolver<ResolversTypes['GameOptions'], ParentType, ContextType>,
  state?: Resolver<ResolversTypes['GameState'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type GameOptionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameOptions'] = ResolversParentTypes['GameOptions']> = {
  playersCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  multicolor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type GameStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameState'] = ResolversParentTypes['GameState']> = {
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGame?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<MutationCreateGameArgs, 'input'>>,
  joinGame?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<MutationJoinGameArgs, 'gameId' | 'input'>>,
  playCard?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<MutationPlayCardArgs, 'gameId' | 'input'>>,
  discardCard?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<MutationDiscardCardArgs, 'gameId' | 'input'>>,
  hintColor?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<MutationHintColorArgs, 'gameId' | 'input'>>,
  hintNumber?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<MutationHintNumberArgs, 'gameId' | 'input'>>,
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  bot?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<QueryGameArgs, 'gameId'>>,
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  gameStateChanged?: SubscriptionResolver<Maybe<ResolversTypes['Game']>, "gameStateChanged", ParentType, ContextType, RequireFields<SubscriptionGameStateChangedArgs, 'gameId'>>,
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type Resolvers<ContextType = any> = {
  Game?: GameResolvers<ContextType>,
  GameOptions?: GameOptionsResolvers<ContextType>,
  GameState?: GameStateResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Player?: PlayerResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Upload?: GraphQLScalarType,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

