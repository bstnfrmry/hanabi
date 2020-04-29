import { last } from "lodash";
import { useEffect } from "react";

import { useGame, useSelfPlayer } from "~/hooks/game";
import useNetwork from "~/hooks/network";
import usePrevious from "~/hooks/previous";
import { playSound } from "~/lib/sound";

export function useSoundEffects() {
  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const network = useNetwork();

  /**
   * Handle notification sounds.
   */
  useEffect(() => {
    if (!selfPlayer) return;
    if (!selfPlayer.notified) return;

    playSound(`/static/sounds.bell.mp3`);
    const timeout = setTimeout(() => network.setNotification(game, selfPlayer, false), 10000);

    return () => clearTimeout(timeout);
  }, [selfPlayer && selfPlayer.notified]);

  /**
   * Play sound when gaining a hint token
   */
  const hintsCount = game ? game.tokens.hints : 0;
  const previousHintsCount = usePrevious(hintsCount);
  useEffect(() => {
    if (previousHintsCount === undefined) return;

    const timeout = setTimeout(() => {
      playSound(`/static/sounds/coin.mp3`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [hintsCount === previousHintsCount + 1]);

  useEffect(() => {
    if (previousHintsCount === undefined) return;

    const timeout = setTimeout(() => {
      playSound(`/static/sounds/swoosh.wav`);
    }, 200);

    return () => clearTimeout(timeout);
  }, [hintsCount === previousHintsCount - 1]);

  const turnsCount = game ? game.turnsHistory.length : 0;
  const previousTurnsCount = usePrevious(turnsCount);
  useEffect(() => {
    if (previousTurnsCount === undefined) return;

    playSound(`/static/sounds/rewind.mp3`);
  }, [turnsCount < previousTurnsCount]);

  /**
   * Play sound when discarding a card
   */
  useEffect(() => {
    if (!game) return;
    if (!game.discardPile.length) return;

    playSound(`/static/sounds/card-scrape.mp3`);
  }, [game && game.discardPile.length]);

  /**
   * Play sound when successfully playing a card
   */
  useEffect(() => {
    if (!game) return;

    const latestCard = last(game.playedCards);
    if (!latestCard) return;

    const path = latestCard.number === 5 ? `/static/sounds/play-5.mp3` : `/static/sounds/play.mp3`;

    playSound(path);
  }, [game && game.playedCards.length]);
}
