import { cloneDeep } from "lodash";
import IGameState, { IReviewComment } from "~/lib/state";

export function updateReviewComment(game: IGameState, newComment: IReviewComment) {
  const newGame = cloneDeep(game);
  const comments = game.reviewComments.filter(
    (rc) => !(rc.afterTurnNumber === newComment.afterTurnNumber && rc.playerId === newComment.playerId)
  );
  if (!newComment.comment.match(/^\s*$/)) {
    comments.push(newComment);
  }
  newGame.reviewComments = comments;
  return newGame;
}

export function findComment(game: IGameState, playerId: string, turnNumber: number): IReviewComment | undefined {
  return game.reviewComments.find((rc) => rc.playerId === playerId && rc.afterTurnNumber === turnNumber);
}

export function findExistingCommentText(game: IGameState, playerId: string, turnNumber: number) {
  return findComment(game, playerId, turnNumber)?.comment;
}
