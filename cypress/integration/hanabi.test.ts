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

  cy.startGame();

  cy.skipTutorial();

  cy.waitForTurn().giveHint(1, "number", 1);
  cy.waitForTurn().giveHint(3, "number", 1);
  cy.waitForTurn().giveHint(3, "number", 2);
  cy.waitForTurn().discard("D");
  cy.waitForTurn().giveHint(2, "number", 1);
  cy.waitForTurn().play("B");
  cy.waitForTurn().discard("D");
  cy.waitForTurn().discard("D");
  cy.waitForTurn().giveHint(3, "color", "green");
  cy.waitForTurn().discard("D");
  cy.waitForTurn().discard("D");
  cy.waitForTurn().play("A");
  cy.waitForTurn().play("B");
  cy.waitForTurn().play("C");
  cy.waitForTurn().play("C");
  cy.waitForTurn().giveHint(1, "number", 2);
  cy.waitForTurn().discard("D");
  cy.waitForTurn().discard("D");

  cy.expectGameOver();
  cy.expectScore(20);
});
