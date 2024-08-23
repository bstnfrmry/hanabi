import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LoadingScreen from "~/components/loadingScreen";
import { logFailedPromise } from "~/lib/errors";

/**
 * Legacy route for /play?gameId={gameId}
 * Redirects to /{gameId}
 */
export default function Play() {
  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    if (!gameId) return;

    router.replace(`/${gameId}`).catch(logFailedPromise);
  }, [gameId, router]);

  return <LoadingScreen />;
}
