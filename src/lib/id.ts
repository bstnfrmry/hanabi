import shortid from "shortid";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export type ID = string;

export function readableUniqueId(): ID {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 3,
    separator: "",
    style: "capital",
  });
}

export function uniqueId(): ID {
  return shortid();
}

export function generateShuffleSeed(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
