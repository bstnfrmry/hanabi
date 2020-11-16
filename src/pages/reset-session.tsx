import React from "react";

import LoadingScreen from "~/components/loadingScreen";
import withSession from "~/lib/session";

export const getServerSideProps = withSession(async function(ctx) {
  ctx.req.session.destroy();
  await ctx.req.session.save();

  ctx.res.statusCode = 302;
  ctx.res.setHeader("Location", "/");

  return {
    props: {},
  };
});

export default function ResetSession() {
  return <LoadingScreen />;
}
