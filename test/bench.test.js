const { ai } = require('../src/ai')
const { Game } = require('../src/game')
const { range, sumBy, groupBy } = require('lodash')

const SIZE = 100

const options = {
  extension: false,
  logging: false,
  players: [
    { name: 'P1', onPlay: ai },
    { name: 'P2', onPlay: ai },
    { name: 'P3', onPlay: ai },
  ]
}

const start = new Date()
Promise.all(range(SIZE).map(async () => {
  const game = new Game(options)
  await game.play()

  return game
})).then(games => {
  const average = sumBy(games, game => game.score) / games.length
  const byReasons = groupBy(games, game => game.state.reason)
  const completed = games.filter(game => game.score === game.maxScore).length

  console.log(`Played ${games.length} games in ${new Date() - start}ms`)
  console.log(`Completed ${completed} / ${games.length}`)
  console.log(`Average: ${average} / ${games[0].maxScore}`)
  console.log(`Reasons: ${Object.keys(byReasons).map(reason => `${reason}: ${byReasons[reason].length}`).join(' · ')}`)
})

