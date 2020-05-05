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
