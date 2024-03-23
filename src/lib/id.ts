import shortid from "shortid";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export type ID = string;

export function readableUniqueId(): ID {
  const main = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 3,
    separator: "",
    style: "capital",
  });
  return `${main}-0`;
}

export function nextGameId(existingId: string) {
  const parts = existingId.split("-");
  if (parts.length != 2) {
    throw Error("Invalid ID");
  }
  const nextInSequence = parseInt(parts[1]) + 1;
  return parts[0] + `-${nextInSequence}`;
}

export function uniqueId(): ID {
  return shortid();
}

export function generateShuffleSeed(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
