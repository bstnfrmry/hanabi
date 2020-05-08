import { last } from "lodash";
import { useEffect } from "react";

import { useGame, useSelfPlayer } from "~/hooks/game";
import usePrevious from "~/hooks/previous";
import { useReplay } from "~/hooks/replay";
import { playSound } from "~/lib/sound";

export function useSoundEffects() {
  const game = useGame();
  const replay = useReplay();
  const selfPlayer = useSelfPlayer();

  const isReplaying = replay.cursor !== null;

  /**
   * Handle notification sounds.
   */
  useEffect(() => {
    if (!selfPlayer) return;
    if (!selfPlayer.notified) return;

    playSound(`/static/sounds.bell.mp3`);
  }, [selfPlayer && selfPlayer.notified]);

  /**
   * Play sound when gaining a hint token
   */
  const hintsCount = game ? game.tokens.hints : 0;
  const previousHintsCount = usePrevious(hintsCount);
  useEffect(() => {
    if (isReplaying) return;
    if (previousHintsCount === undefined) return;

    const timeout = setTimeout(() => {
      playSound(`/static/sounds/coin.mp3`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [hintsCount === previousHintsCount + 1]);

  useEffect(() => {
    if (isReplaying) return;
    if (previousHintsCount === undefined) return;

    const timeout = setTimeout(() => {
      playSound(`/static/sounds/swoosh.wav`);
    }, 200);

    return () => clearTimeout(timeout);
  }, [hintsCount === previousHintsCount - 1]);

  const turnsCount = game ? game.turnsHistory.length : 0;
  const previousTurnsCount = usePrevious(turnsCount);
  useEffect(() => {
    if (isReplaying) return;
    if (previousTurnsCount === undefined) return;

    playSound(`/static/sounds/rewind.mp3`);
  }, [turnsCount < previousTurnsCount]);

  /**
   * Play sound when discarding a card
   */
  useEffect(() => {
    if (!game) return;
    if (!game.discardPile.length) return;
    if (isReplaying) return;

    playSound(`/static/sounds/card-scrape.mp3`);
  }, [game && game.discardPile.length]);

  /**
   * Play sound when successfully playing a card
   */
  useEffect(() => {
    if (!game) return;
    if (isReplaying) return;

    const latestCard = last(game.playedCards);
    if (!latestCard) return;

    const path = latestCard.number === 5 ? `/static/sounds/play-5.mp3` : `/static/sounds/play.mp3`;

    playSound(path);
  }, [game && game.playedCards.length]);
}
