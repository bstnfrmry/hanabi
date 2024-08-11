import { last } from "lodash";
import { useEffect } from "react";
import { useGame, useSelfPlayer } from "~/hooks/game";
import usePrevious from "~/hooks/previous";
import { useReplay } from "~/hooks/replay";
import { useUserPreferences } from "~/hooks/userPreferences";
import { setNotification } from "~/lib/firebase";
import { playSound, vibrate } from "~/lib/sound";
import { isCardAction, isDiscardAction, isHintAction } from "~/lib/state";

type RecognizedAction = "Rewind" | "Hint" | "Discard" | "Strike" | "SilentStrike" | "Played" | "Played-5" | undefined;
type ActionSoundMap = {
  [key in RecognizedAction]: string | undefined;
};

const SoundsForAction: ActionSoundMap = {
  "Rewind": "/static/sounds/rewind.mp3",
  "Hint": "/static/sounds/swoosh.wav  ",
  "Discard": "/static/sounds/card-scrape.mp3",
  "Strike": "/static/sounds/strike.mp3",
  "SilentStrike": undefined,
  "Played": "/static/sounds/play.mp3",
  "Played-5": "/static/sounds/play-5.mp3",
};

export function useSoundEffects() {
  const game = useGame();
  const replay = useReplay();
  const selfPlayer = useSelfPlayer(game);
  const [userPreferences] = useUserPreferences();

  const turnsCount = game ? (game.originalGame || game).turnsHistory.length : 0;
  const previousTurnsCount = usePrevious(turnsCount);
  const isReplaying = replay.cursor !== null;
  const turn = last(game?.turnsHistory);

  /**
   * Handle notification sounds.
   */
  useEffect(() => {
    if (!selfPlayer?.notified) return;

    playSound(`/static/sounds/bell.mp3`);
    vibrate(200);
    const timeout = setTimeout(() => setNotification(game, selfPlayer, false), 10000);

    return () => clearTimeout(timeout);
  }, [selfPlayer, selfPlayer?.notified, game]);

  useEffect(() => {
    function determineLastGameEvent(): RecognizedAction {
      if (turnsCount < previousTurnsCount) {
        return "Rewind";
      }
      if (turnsCount === previousTurnsCount) {
        return undefined;
      }
      if (isHintAction(turn.action)) {
        return "Hint";
      } else if (isDiscardAction(turn.action)) {
        return "Discard";
      } else if (isCardAction(turn.action)) {
        if (turn.failed) {
          if (userPreferences.soundOnStrike) {
            return "Strike";
          } else {
            return "SilentStrike";
          }
        } else {
          if (turn.action.card.number === 5) {
            return "Played-5";
          } else {
            return "Played";
          }
        }
      }

      console.warn(`Unexpected SFX inspection:`);
      return undefined;
    }

    if (isReplaying) return;
    if (!turn) return;
    const namedEvent = determineLastGameEvent();
    if (!namedEvent) return;
    const soundFile = SoundsForAction[namedEvent];

    playSound(soundFile);
  }, [turnsCount, previousTurnsCount, turn, userPreferences.soundOnStrike, isReplaying]);
}
