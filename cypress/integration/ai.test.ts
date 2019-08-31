specify("Hanabi AI", () => {
  cy.createGame({
    playersCount: 4,
    multicolor: false
  });

  cy.joinGame({
    bot: true
  });

  cy.addAI();
  cy.addAI();
  cy.addAI();

  cy.startGame();

  cy.skipTutorial();
});
