// myMutationFunction.ts
import { mutation } from "./_generated/server";
import { Pokemon, POKEMON_COUNT, Session } from "../src/protocol";
import { getRound } from "./nextRating";

export default mutation(
  async ({ db }, which: number, session: number, round: [number, number]) => {
    const sessionObject: Session = (await db
      .table("sessions")
      .filter((q) => q.eq(q.field("id"), session))
      .first())!;

    // Double voting?
    const [generation, guess] = round;
    if (
      sessionObject.generation !== generation ||
      sessionObject.offset !== guess
    ) {
      return;
    }

    const dbRound = await getRound(db, sessionObject);

    const [pokeFor, pokeAgainst] =
      which == 1
        ? [dbRound.firstPokemon, dbRound.secondPokemon]
        : [dbRound.secondPokemon, dbRound.firstPokemon];

    pokeFor.totalVotes += 1;
    pokeFor.votesFor += 1;
    pokeAgainst.totalVotes += 1;
    sessionObject.offset += 2;

    if (sessionObject.offset > POKEMON_COUNT - 2) {
      sessionObject.generation += 1;
      sessionObject.offset = 0;
    }

    db.replace(pokeFor._id, pokeFor);
    db.replace(pokeAgainst._id, pokeAgainst);
    db.replace(sessionObject._id, sessionObject);
  }
);
