specify("Hanabi", () => {
  cy.createGame({
    playersCount: 4,
    multicolor: true,
    seed: "E2E"
  });

  cy.joinGame({
    name: "Ibanah"
  });

  cy.addAI();
  cy.addAI();
  cy.addAI();
  cy.addAI();

  cy.startGame();

  cy.skipTutorial();

  cy.giveHint(1, "number", 1);

  cy.waitForTurn();
  cy.giveHint(3, "number", 1);

  cy.waitForTurn();
  cy.giveHint(3, "number", 2);

  cy.waitForTurn();
  cy.discard("D");

  cy.waitForTurn();
  cy.giveHint(2, "number", 1);

  cy.waitForTurn();
  cy.play("B");

  cy.waitForTurn();
  cy.discard("D");

  cy.waitForTurn();
  cy.discard("D");

  cy.waitForTurn();
  cy.giveHint(3, "color", "green");

  cy.waitForTurn();
  cy.discard("D");

  cy.waitForTurn();
  cy.discard("D");

  cy.waitForTurn();
  cy.play("A");

  cy.waitForTurn();
  cy.play("B");

  cy.waitForTurn();
  cy.play("C");

  cy.waitForTurn();
  cy.play("C");

  cy.waitForTurn();
});
