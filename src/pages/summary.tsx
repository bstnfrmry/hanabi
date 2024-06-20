import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LoadingScreen from "~/components/loadingScreen";

/**
 * Legacy route for /summary?gameId={gameId}
 * Redirects to /{gameId}/summary
 */
export default function Summary() {
  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    if (!gameId) return;

    router.replace(`/${gameId}/summary`);
  }, [gameId, router]);

  return <LoadingScreen />;
}
