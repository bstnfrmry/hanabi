/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    waitForTurn(): Chainable<Subject>;

    createGame(options: object): void;

    joinGame(options: object): void;

    addAI(): void;

    startGame(): void;

    skipTutorial(): void;

    giveHint(
      playerPosition: number,
      hintType: "color" | "number",
      hintValue: string | number
    ): void;

    discard(cardPosition: "A" | "B" | "C" | "D" | "E"): void;

    play(cardPosition: "A" | "B" | "C" | "D" | "E"): void;

    expectGameOver(): void;

    expectScore(score: number): void;
  }
}
