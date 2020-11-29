/* eslint-disable @typescript-eslint/camelcase */

export const es = {
  hanabi: "Hanabi",
  welcome: "Bienvenido",
  newGame: "Nuevo juego",
  tagline: "¡Juega Hanabi en línea con tus amigos!",
  subTagline: "Juego de cartas multijugador y cooperativo, disponible en teléfonos, tabletas y ordenadores",
  createRoom: "Crear un juego",
  joinRoom: "Unirse a un juego",
  rejoinGame: "Volver al juego",
  whatsHanabi: "¿Qué es Hanabi?",
  invitationByPlayers: "{{playersNames}} te invita a un juego de Hanabi 🎉",
  invitationByPlayers_plural: "{{playersNames}} te invitan a un juego de Hanabi 🎉",
  invitationNoPlayers: "Has recibido una invitación a un juego de Hanabi 🎉",
  gameFull: "¡Llegaron todos!",
  gameNotFull: "{{count}} / {{playersCount}} jugador presente",
  gameNotFull_plural: "{{count}} / {{playersCount}} jugadores presentes",
  startGame: "Comenzar juego",
  addAi: "+ añadir una IA",
  lobby: "Lobby",
  choosePlayerName: "Escoge tu nombre de jugador",
  join: "Unirse",
  autoplay: "Autoplay",
  shareGame: "Comparte este juego",
  copy: "Copiar",
  waitForOthers: "Puedes esperar a los demás o ",
  gameStarted: "¡Comenzó el juego!",
  gameStarts: "¡Comienza el juego!",
  discardPile: "descartadas ({{discardLength}})",
  preventLossContent: "Esta acción os hará perder un punto - ¿Continuar?",
  rewind: "Rebobinar 🕑",
  backToGame: "Volver al juego",
  theirTurn: "¡Le toca a {{currentPlayerName}}!",
  go: "¡Vamos!",
  estimatedMaxScore: "Puntuación máxima est. para este mazo: {{reachableScore}}",
  keepPracticing: "¡Nada mal!",
  congrats: "¡Increíble!",
  hideStats: "Mostrar cartas",
  showStats: "Mostrar estadísticas",
  gameOver: "¡Fin del juego! - La puntuación es {{playedCardsLength}} 🎉",
  score: "Hanabi - Puntuación: {{score}} / {{maxPossibleScore}}",
  turnsLeftDisclaimer: "· queda 1 turno",
  turnsLeftDisclaimer_plural: "· quedan {{count}} turnos",
  cardLeft: "quedan {{pileLength}}",
  tokens: "fichas",
  deck: "mazo",
  loading: "Cargando...",
  menu: "Menú",
  tutorial: "Tutorial",
  rules: "Reglas",
  yourTurn: "¡Te toca!",
  youWillStart: "Serás el primero en jugar",
  hide: "Ocultar",
  reveal: "Mostrar",
  cardSelected: "Carta {{position}} seleccionada",
  eightTokens: "8 fichas",
  cannotDiscard: "No se puede descartar",
  noTokens: "No quedan fichas para dar información",
  selectVignette: "Selecciona un color o un valor",
  hint: "Dar información",
  negativeHintColor: "No tienes ninguna carta de color {{color}}",
  negativeHintNumber: "No tienes ningún {{number}}",
  positiveHintColor: "Tu carta {{ positions }} es de color {{ color}}",
  positiveHintNumber: "Tu carta {{ positions }} es un {{number}}",
  positiveHintNumberSequence: "Tu carta {{ positions }} es un {{ number }} o más",
  positiveHintColor_plural: "Tus cartas {{ positions }} son de color {{ color }}",
  positiveHintNumber_plural: "Tus cartas {{ positions }} son {{ number }}",
  positiveHintNumberSequence_plural: "Tus cartas {{ positions }} son {{ number }} o más",
  you: "Tú",
  hinted: "Información",
  played: "Jugadas",
  discarded: "Descartadas",
  rollback: "Deshacer",
  rollbackDisclaimer: "Estás a punto de deshacer la última acción.",
  cannotRollback: "Todavía no puedes deshacer",
  abort: "Volver al juego",
  introTutorial: "Tutorial",
  introContent: "¡Aprende a jugar!",
  playedCardsTutorial: "Cartas jugadas",
  playedCardsTutorialContent:
    "Aquí estarán las cartas que se han jugado.\nPara ganar hay que llegar al 5 de cada color entre todos.",
  discardTutorial: "Descarte",
  discardTutorialContent:
    "Aquí aparecerán las cartas descartadas.\nEvitad descartar cartas que sean\nnecesarias para terminar el juego.",
  yourGameTutorial: "Tu juego",
  yourGameTutorialContent:
    "Estas son tus cartas.\nTú no puedes verlas, pero los demás jugadores\nsí pueden y te darán información sobre ellas.",
  teammatesTutorial: "Compañeros",
  teammatesTutorialContent:
    "Estos son tus compañeros de equipo.\nAl igual que tú, no pueden ver sus propias cartas.\nDales información para ayudarlos a jugar o descartar cartas.",
  hintTokensTutorial: "Fichas de información",
  hintTokensTutorialContent:
    "Algunas acciones tienen un costo:\n\n- Dar información gasta 1 ficha de información.\n- Descartar una carta recupera 1 ficha de información.\n- Jugar un 5 recupera 1 ficha de información.",
  strikeTokensTutorial: "Fichas de error",
  strikeTokensTutorialContent:
    "Si se juega una carta que no se puede colocar,\nla carta se descarta y se añade 1 ficha de error.\nSi se acumulan 3 fichas de error, perdéis el juego.",
  yourTurnTutorial: "¡Es tu turno!",
  yourTurnTutorialContent:
    "Tienes 3 opciones:\n\n- Toca tus cartas para jugar una de ellas...\n- ... o para descartarla.\n- Toca las cartas de otro jugador para darle información.",
  skip: "✕ Saltar",
  offline: "¡Estás sin conexión!",
  apologies: "Lo lamentamos, algo salió mal 😕",
  errorWillInvestigate:
    "Lo investigaremos lo más pronto posible. No dudes en <1>escribirnos</1> para contarnos lo que pasó.",
  earlyDevelopment: "El juego está aún en desarrollo y nos encantaría recibir tus comentarios.",
  publicRepo: "También tenemos un <1>repositorio público de Github</1> donde puedes contribuir o reportar un problema.",
  backMenu: "Regresar al menú",
  landingImageAlt: "Logotipo del juego de cartas Hanabi en línea",
  classicVariant: "Clásico",
  orangeVariant: "Naranja",
  multicolorVariant: "Multicolor",
  rainbowVariant: "Arcoiris",
  sequenceVariant: "Secuencia",
  classicVariantDescription: "Un juego clásico de Hanabi con 5 colores",
  multicolorVariantDescription: "Se añade una 6ta pinta con una sola carta de cada número",
  rainbowVariantDescription: "Se añade una 6ta pinta que combina con todos los demás colores",
  orangeVariantDescription: "Se añade una 6ta pinta clásica",
  sequenceVariantDescription: "La información númerica también indica cartas con números superiores",
  showDirectHints: "Mostrar",
  hideDirectHints: "Ocultar",
  botSpeed: "Velocidad de los bots",
  normalGameExplanation: "Podrás jugar en línea compartiendo el enlace del juego con tus amigos",
  passandplayExplanation:
    "En el modo 'Pasa y Juega' podrás jugar con otros jugadores que estén físicamente en el mismo lugar, pasando el dispositivo a cada jugador en su turno",
  private: "Privado",
  hints: "Conclusiones",
  allowRollback: "Permitir deshacer acciones",
  preventLoss: "Evitar perder",
  passandplay: "Pasa y Juega",
  passandplaySubtext: "Todos los jugadores están en el mismo lugar y juegan en un único dispositivo",
  privateSubtext: "Este juego no será visible en la sección 'Unirse a un juego'",
  advancedOptions: "Opciones avanzadas",
  players: "Jugadores",
  mode: "Modo",
  seed: "Semilla",
  objective: "Objetivo",
  rulesIntro:
    "Hanabi es un juego de cartas creado por Antoine Bauza. Es cooperativo, es decir, los jugadores no juegan unos contra otros sino que colaboran para lograr un objetivo común. Los jugadores forman un equipo de pirotécnicos distraídos que, por falta de atención, han mezclado su pólvora, mechas y cohetes para un espectáculo de fuegos artificiales. El espectáculo comenzará pronto y la situación es más bien caótica. Todos los jugadores tendrán que colaborar para evitar que el espectáculo sea un desastre.",
  rulesGoal:
    "El objetivo del equipo de pirotécnicos es construir 5 grupos de fuegos artificiales, uno de cada color (blanco, rojo, azul, amarillo y verde), combinando cartas de valor ascendente (1, 2, 3, 4, 5) del mismo color.",
  rulesSetupTitle: "Instalación",
  rulesSetup:
    "La aplicación prepara todo por ti. Muy útil, ¿no? 😉. Al inicio del juego, habrá 8 fichas azules de información, para compartir información con otros jugadores, y 3 fichas rojas de errores.\n\nEl mazo contiene 50 cartas, 10 de cada color, <1>numeradas 1, 1, 1, 2, 2, 3, 3, 4, 4, 5</1>.\n· En un juego con 2 o 3 jugadores, cada uno recibirá 5 cartas\n· En un juego con 4 o 5 jugadores, cada uno recibirá 4 cartas.\n\n¡Y los jugadores no pueden ver sus propias cartas!",
  rulesGameTitle: "Mecanismo del juego",
  rulesGame:
    "En su turno, cada jugador realiza exactamente una de las siguientes acciones. No está permitido pasar. \n1. Darle información a otro jugador.\n2. Descartar una carta.\n3. Jugar una carta\n\n¡Los jugadores no tienen permitido dar información o sugerencias durante el turno de otro jugador!",
  rulesHintTitle: "1. Dar información",
  rulesHint:
    "Dar información gasta una ficha azul de información. Nota: Si no hay ninguna de estas fichas, no puedes dar información y debes realizar otra acción.\n\nPuedes darle información a un compañero sobre las cartas que tiene haciendo clic sobre su mano de cartas. Puedes decirle al jugador algo sobre un color (y solo uno), o sobre un número (y solo uno) de carta.",
  rulesDiscardTitle: "2. Descartar una carta",
  rulesDiscard:
    "Descartar una carta recupera una ficha azul de información. Descartas una carta de tu mano haciendo clic sobre ella. Después de descartar, se añade a tu mano una nueva carta del mazo. \nNota: Si están todas las 8 fichas azules, no puedes descartar y debes realizar otra acción. \nPuedes consultar las cartas descartadas en todo momento.",
  rulesPlayTitle: "3. Jugar una carta",
  rulesPlay:
    "En tu turno, para jugar una carta, tómala de tu mano y juégala.\nPasará una de dos cosas:\n· Si la carta comienza o continúa un color de fuegos artificiales, se añadirá a ese montón\n· Si la carta no inicia ni añade un color de fuegos artificiales, será descartada, y se añadirá una ficha roja de error\nLuego tomas una carta del mazo.\n\nCuando un jugador termina un color de fuegos artificiales jugando una carta con valor de 5, se recupera una ficha azul de información. Si todas las fichas azules están disponibles, no se recuperan fichas.",
  rulesEndTitle: "Fin del juego",
  rulesEnd:
    "Hanabi puede terminar de tres maneras diferentes:\n· Si reciben la tercera ficha roja de error, ¡los fuegos artificiales se incendiarán!\n· Si el equipo completa todos los 5 colores de fuegos artificiales con una carta de valor 5, el equipo hace un espectáculo maravilloso de fuegos artificiales y obtiene la puntuación máxima de 25, ¡30 con la opción multicolor!\n· Si un jugador toma la última carta del mazo, el juego está a punto de finalizar. Cada jugador tendrá un turno más, incluyendo al jugador que tomó la última carta. No se pueden tomar más cartas durante estos turnos finales.\n\nLa puntuación que reciben los jugadores se basa en el número de fuegos artificiales que ensamblaron.",
  rulesExtensionTitle: "Extensión",
  rulesExtensionMulticolor:
    "🎨 La variante multicolor añade un 6to montón y una 6ta pinta de cartas con una sola carta de cada número: 1, 2, 3, 4, 5. Estos fuegos artificiales, por lo tanto, son más escasos, y tendrás que tener cuidado de no descartarlos. Las reglas son las mismas, y hay que completar los 6 montones para lograr la puntuación máxima de 30 puntos.",
  rulesExtensionRainbow:
    "🌈 La variante arcoiris añade un 6to montón con la misma cantidad de cartas de los otros 5 (tres 1, 2 de cada número 2/3/4, y un 5). La particularidad es que las cartas arcoiris son de todos los colores. Cuando des información sobre cualquier color, incluirá a las cartas arcoiris.",
  rulesUsTitle: "¿Quiénes somos?",
  rulesUs:
    "Somos un grupo de adictos a los juegos de mesa. En la cuarentena de 2020 nos propusimos encontrar una alternativa para jugar juntos remotamente. \nComo nos divertimos tanto programando como jugando Hanabi, decidimos crear una versión del juego en línea, compatible para móviles.\n\n👉 Al igual que nosotros, si te gusta el juego, ¡por favor compra la <2>versión física</2> para apoyar al creador!",
  rulesContact: "✉️ <1>Comunícate con nosotros</1> si tienes alguna pregunta o sugerencia",
  rulesContributeRepo: "💻 También tenemos un <1>repositorio público en Github</1> si quieres contribuir.",
  rulesDiscordServer: "🗣 Únete a nuestro servidor Discord para discutir posibles mejoras y sugerencias",
  rulesBuymeacoffee:
    "🙇‍♀️ Y también puedes apoyar nuestra iniciativa y ayudar a cubrir los gastos del servidor comprándonos un café en buymeacoffee.com",
  noRoom: "No hay ningún juego disponible",
  faster: "Muy rápido",
  fast: "Rápido",
  slow: "Lento",
  discard: "Descartar",
  play: "Jugar",
  green: "verde",
  red: "rojo",
  yellow: "amarillo",
  blue: "azul",
  white: "blanco",
  multicolor: "multicolor",
  orange: "naranja",
  green_plural: "verde",
  red_plural: "rojo",
  yellow_plural: "amarillo",
  blue_plural: "azul",
  white_plural: "blanco",
  multicolor_plural: "multicolor",
  orange_plural: "naranja",
  summary: "Resumen",
  summarySubtitle: "Nuestro juego de Hanabi",
  gameCompleted: "Juego completado en {{ gameDuration }}",
  result: "Nuestro resultado",
  evolution: "Evolución",
  evolutionSubtext:
    "¡Sigue la historia del juego! Las cartas de cada jugador se muestran, sin importar si podían jugarse, descartarse o peligrosas (una carta que reduciría la puntuación máxima posible si la descartas, como una multicolor o un 5).",
  playerActions: "Media de acciones por jugador",
  playHints: "Jugadas promedio por dato: <1>{{playsPerHint}}</1>",
  playerHints: "¿Quién dio más información?",
  tryOutTitle: "¡Pruébalo!",
  tryOutButton: "Prueba esta mezcla",
  tryOutAlternative:
    "También puedes jugar con otras configuraciones y conocer a nuestra Inteligencia Artificial en <1>hanabi.cards</1>",
  back: "Volver",
  statsPlayable: "jugable",
  statsDiscardable: "descartable",
  statsDangerous: "peligrosa",
  statsTurnCard: "En ese turno, la carta era",
  statsTurnAction: "Acción del jugador",
  showInsights: "Mostrar detalles",
  showCards: "Mostrar cartas",
  started: "Comenzó",
  youGaveHintTurn: "Diste información a <1></1> sobre sus <3></3>",
  youDiscardedTurn: "Descartaste <1></1>",
  youPlayedTurn: "Jugaste <1></1>",
  somebodyHintedYouTurn: "<0></0> te dio información sobre tus <2></2>",
  somebodyHintedSomebodyTurn: "<0></0> dio información a <2></2> sobre sus <4></4>",
  somebodyDiscardedTurn: "<0></0> descartó <2></2>",
  somebodyPlayedTurn: "<0></0> jugó <2></2>",
  whatYouDrewTurn: "y tomaste <1></1>",
  whatTheyDrewTurn: "y tomó <1></1>",
  selectLanguage: "Selecciona un idioma",
  creatingGame: "Partida en creación...",
  partySetup: "Jugadores: {{players}} · Modo: {{variant}} · Semilla #{{shuffle}}",
  sendMessagePlaceholder: "Envía un mensaje a tus compañeros de equipo",
  sendMessage: "Enviar",
  message: "<0></0>: <1></1>",
  pageNotFound: "Página no encontrada",
  colorBlindMode: "Modo daltonismo",
  colorBlindModeSubtext: "Mostrar símbolos en la parte superior de las tarjetas para ayudar a distinguir los colores",
  contributeLanguage: "¡Contribuir!",
  buymeacoffeePostGame: "Apoya el juego, <2>cómpranos un café</2>",
};
