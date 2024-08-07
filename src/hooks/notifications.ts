import { useEffect } from "react";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";
import { IGameStatus } from "~/lib/state";

export function useNotifications() {
  const game = useGame();
  const currentPlayer = useCurrentPlayer(game);
  const selfPlayer = useSelfPlayer(game);

  /**
   * Request notification permissions when game starts
   */
  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (!game) return;
    if (game.status !== IGameStatus.ONGOING) return;

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [game && game.status === IGameStatus.ONGOING]);

  /**
   * Notify player it's time to play when document isn't focused.
   */
  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (!currentPlayer) return;
    if (currentPlayer !== selfPlayer) return;
    if (document.hasFocus()) return;

    const title = "Your turn!";
    const options = {
      icon: "/static/hanab-192.png",
    };

    try {
      // Attempt sending the notification through the Web API.
      const notification = new Notification(title, options);

      const onNotificationClick = () => {
        window.focus();
        notification.close();
      };

      let closeTimeout;
      notification.onshow = () => {
        closeTimeout = setTimeout(() => {
          notification.close.bind(notification);
        }, 20000);
      };

      notification.addEventListener("click", onNotificationClick);

      return () => {
        notification.removeEventListener("click", onNotificationClick);

        if (closeTimeout) {
          clearTimeout(closeTimeout);
        }
      };
    } catch (e) {
      // Not handled for many mobile browsers.
    }
  }, [currentPlayer === selfPlayer]);
}
