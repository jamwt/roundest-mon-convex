import { Session } from "../src/protocol";
import { mutation } from "./_generated/server";

export default mutation(async ({ db }, session: number) => {
  const existing = await db
    .table("sessions")
    .filter((q) => q.eq(q.field("id"), session))
    .first();

  if (existing === null) {
    const sessionObject: Session = {
      id: session,
      generation: 0,
      offset: 0,
    };
    db.insert("sessions", sessionObject);
  }
});
