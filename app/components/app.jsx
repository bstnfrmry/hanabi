import React, { useState } from "react";
import Modal from "react-modal";
import { cloneDeep } from 'lodash'

import PlayersBoard from "./playersBoard";
import GameBoard from "./gameBoard";
import ActionArea from "./actionArea";
const { Game } = require('./game')
const { ai } = require('../../src/ai')

Modal.setAppElement('#app')

export default ({ seed = '1234' }) => {
  const [game, setGame] = useState(new Game({
    extension: false,
    logging: true,
    seed,
    players: [
      { name: "Tomoa", onPlay: ai },
      { name: "Akiyo", onPlay: ai },
      { name: "Futaba", onPlay: ai },
      { name: "Miho", onPlay: ai }
    ]
  }))

  const [selectedPlayer, selectPlayer] = useState(null)

  const play = async () => {
    await game.play()
    setGame(cloneDeep(game)) // 🤮
  }

  return <div id="app" className="flex flex-row justify-between w-100 h-100">
    <PlayersBoard game={game} onSelectPlayer={selectPlayer} />
    <div className="flex flex-column h-100">
      <GameBoard game={game} onSimulateTurn={() => play()} />
      <ActionArea game={game} selectedPlayer={selectedPlayer} />
    </div>
  </div>
};
