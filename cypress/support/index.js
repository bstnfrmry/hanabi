import { defaults } from "lodash";

Cypress.Commands.add("createGame", options => {
  options = defaults(options, {
    playersCount: 4,
    multicolor: false,
    seed: "E2E",
    botsSpeed: "Faster"
  });

  cy.visit("/");
  cy.get("#create-room").click();

  cy.get("#players-count").select(`${options.playersCount}`);

  if (options.multicolor) {
    cy.get("#multicolor").check();
  }

  cy.get("#advanced-options").click();
  if (options.seed) {
    cy.get("#seed").type(`{selectall}{backspace}${options.seed}`);
  }
  cy.get("#bots-speed").select(options.botsSpeed);

  cy.get("#new-game").click();
});

Cypress.Commands.add("joinGame", options => {
  options = defaults(options, {
    name: "Hanabot",
    emoji: "🐯",
    bot: false
  });

  cy.get("#player-emoji").select(options.emoji);

  cy.get("#player-name").type(`{selectall}{backspace}${options.name}`);

  if (options.bot) {
    cy.get("#autoplay").check();
  }

  cy.get("#join-game").click();
});

Cypress.Commands.add("addAI", () => {
  cy.get("#add-ai").click();
});

Cypress.Commands.add("startGame", () => {
  cy.get("#start-game").click();
});

Cypress.Commands.add("skipTutorial", () => {
  cy.get("#skip-tutorial").click();
});

Cypress.Commands.add("waitForTurn", () => {
  cy.get("#your-turn", { timeout: 10000 });
});

Cypress.Commands.add("giveHint", (playerPosition, hintType, hintValue) => {
  cy.get(`#player-game-${playerPosition} [data-card="A"]`).click();
  cy.get(`#hint-${hintType}-${hintValue}`).click();
  cy.get("#give-hint").click();
});

Cypress.Commands.add("discard", cardPosition => {
  cy.get(`#player-game-self [data-card="${cardPosition}"]`).click();
  cy.get("#discard").click();
});

Cypress.Commands.add("play", cardPosition => {
  cy.get(`#player-game-self [data-card="${cardPosition}"]`).click();
  cy.get("#play").click();
});

Cypress.Commands.add("expectGameOver", () => {
  cy.contains("The game is over!", { timeout: 20000 }).should("be.visible");
});

Cypress.Commands.add("expectScore", score => {
  cy.contains(`Score: ${score}`).should("be.visible");
});
