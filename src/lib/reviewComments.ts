import IGameState, { IReviewComment } from "~/lib/state";

export function addOrReplaceReviewComment(game: IGameState, newComment: IReviewComment) {
  if (game.originalGame) {
    addOrReplaceReviewComment(game.originalGame, newComment);
  }
  const comments = game.reviewComments.filter(
    (rc) => !(rc.afterTurnNumber === newComment.afterTurnNumber && rc.playerId === newComment.playerId)
  );
  if (!newComment.comment.match(/^\s*$/)) {
    comments.push(newComment);
  }
  game.reviewComments = comments;
}

export function findComment(game: IGameState, playerId: string, turnNumber: number): IReviewComment | undefined {
  return game.reviewComments.find((rc) => rc.playerId === playerId && rc.afterTurnNumber === turnNumber);
}

export function findExistingCommentText(game: IGameState, playerId: string, turnNumber: number) {
  return findComment(game, playerId, turnNumber)?.comment;
}
