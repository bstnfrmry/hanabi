specify("Hanabi", () => {
  cy.createGame({
    playersCount: 4,
    multicolor: true,
    seed: "E2E"
  });

  cy.joinGame();

  cy.addAI();
  cy.addAI();
  cy.addAI();

  cy.startGame();

  cy.skipTutorial();

  cy.waitForTurn().giveHint(1, "number", 1);
  cy.waitForTurn().giveHint(3, "number", 1);
  cy.waitForTurn().giveHint(3, "number", 2);
  cy.waitForTurn().discard("D");
  cy.waitForTurn().play("B");
  cy.waitForTurn().discard("D");
  cy.waitForTurn().play("A");
  cy.waitForTurn().play("A");
  cy.waitForTurn().play("A");
  cy.waitForTurn().play("A");
  cy.waitForTurn().giveHint(3, "color", "green");
  cy.waitForTurn().discard("C");
  cy.waitForTurn().giveHint(1, "color", "green");
  cy.waitForTurn().discard("C");
  cy.waitForTurn().giveHint(2, "number", 3);
  cy.waitForTurn().discard("C");
  cy.waitForTurn().discard("C");
  cy.waitForTurn().giveHint(1, "color", "red");

  cy.expectGameOver();
  cy.expectScore(17);
});
