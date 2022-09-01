// myMutationFunction.ts
import { mutation } from "./_generated/server";
import { Pokemon, POKEMON_COUNT, Session } from "../src/schema";

export default mutation(
  async ({ db }, voteFor: number, voteAgainst: number, session: number) => {
    const sessionObject: Session = await db
      .table("sessions")
      .filter((q) => q.eq(q.field("id"), session))
      .first();

    const pokeFor: Pokemon = await db
      .table("pokemon")
      .filter((q) => q.eq(q.field("id"), voteFor))
      .first();

    const pokeAgainst: Pokemon = await db
      .table("pokemon")
      .filter((q) => q.eq(q.field("id"), voteAgainst))
      .first();

    pokeFor.totalVotes += 1;
    pokeFor.votesFor += 1;
    pokeAgainst.totalVotes += 1;
    sessionObject.guesses += 2;
    if (sessionObject.guesses >= POKEMON_COUNT - 2) {
      sessionObject.generation += 1;
      sessionObject.guesses = 0;
    }

    db.replace(pokeFor._id, pokeFor);
    db.replace(pokeAgainst._id, pokeAgainst);
    db.replace(sessionObject._id, sessionObject);
  }
);
