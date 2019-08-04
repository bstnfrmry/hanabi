const { ai } = require('../src/ai')
const { Game } = require('../src/game')

const game = new Game({
    extension: false,
    logging: true,
    seed: '1234',
    players: [
      { name: 'P1', onPlay: ai },
      { name: 'P2', onPlay: ai },
      { name: 'P3', onPlay: ai },
    ] 
})

game.print();
game.play(() => { debugger; })

