const { conventions } = require('../src/ai')
const { Game } = require('../src/game')

const game = new Game({
    extension: false,
    logging: true,
    seed: '1234',
    players: [
      { name: 'P1', onPlay: conventions },
      { name: 'P2', onPlay: conventions },
      { name: 'P3', onPlay: conventions },
    ] 
})

game.print();
game.play(() => { debugger; })

