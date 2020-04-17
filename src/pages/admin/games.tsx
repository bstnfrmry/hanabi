import { Dictionary, groupBy, orderBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";

import HomeButton from "~/components/homeButton";
import LoadingScreen from "~/components/loadingScreen";
import { getMaximumScore, getScore } from "~/game/actions";
import IGameState, { IGameStatus } from "~/game/state";
import useNetwork from "~/hooks/network";

const GamesOrder = [IGameStatus.ONGOING, IGameStatus.OVER, IGameStatus.LOBBY];

export default function Games() {
  const network = useNetwork();

  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<Dictionary<IGameState[]>>({});

  useEffect(() => {
    network.subscribeToOnGoingGames(games => {
      setLoading(false);
      setGames(groupBy(games, game => game.status));
    });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="w-100 h-100 flex justify-center relative bg-main-dark pa2 shadow-5"
      style={{ fontFamily: "Helvetica Neue" }}
    >
      <HomeButton className="absolute top-1 right-1" />
      <table className="w-100 h-100 overflow-y-scroll">
        <thead>
          <tr>
            <td>#</td>
            <td>Seed</td>
            <td>Created</td>
            <td>Mode</td>
            <td>Status</td>
            <td>Players</td>
            <td>Mode</td>
            <td>Score</td>
          </tr>
        </thead>
        <tbody>
          {GamesOrder.map(status => {
            const sortedGames = orderBy(
              games[status],
              game => game.createdAt,
              "desc"
            );

            return (
              <>
                <tr>
                  <td className="pv2 ttu" colSpan={8}>
                    {status} ({sortedGames.length})
                  </td>
                </tr>
                {sortedGames.map(game => {
                  return (
                    <tr key={game.id}>
                      <td>{game.id}</td>
                      <td>{game.options.seed}</td>
                      <td>{moment(game.createdAt).fromNow()}</td>
                      <td>{game.options.gameMode}</td>
                      <td>{game.status}</td>
                      <td>
                        {game.players.map(player => player.name).join(", ")}
                      </td>
                      <td>{game.options.variant}</td>
                      <td>
                        {getScore(game)} / {getMaximumScore(game)}
                      </td>
                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
