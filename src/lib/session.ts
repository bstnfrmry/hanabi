import { withIronSession } from "next-iron-session";

export default function withSession<Handler = any>(handler: Handler) {
  return withIronSession(handler, {
    password: process.env.COOKIE_PASSWORD,
    cookieName: "hanabi.cards",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  });
}
