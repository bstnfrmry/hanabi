import { withIronSession } from "next-iron-session";
import { ID, uniqueId } from "~/lib/id";

export default function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.COOKIE_PASSWORD,
    cookieName: "hanab.cards",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  });
}

export async function getPlayerIdFromSession(req): Promise<ID> {
  let playerId = req.session.get("playerId");
  if (playerId === undefined) {
    playerId = uniqueId();
    req.session.set("playerId", playerId);
    await req.session.save();
  }

  return playerId;
}
