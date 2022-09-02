// myQueryFunction.ts
import { DatabaseReader, query } from "./_generated/server";
import mt from "mersenne-twister";
import _ from "lodash";
import { Pokemon, PokemonRound, POKEMON_COUNT, Session } from "../src/schema";

function seed_shuffled_indexes(session: Session): number[] {
  var indexes = [];
  for (var i = 0; i < POKEMON_COUNT; i++) {
    indexes.push(i + 1);
  }
  const total = indexes.length;
  var rng = new mt([session.id, session.generation]);
  for (var i = 0; i < total; i++) {
    const next_index = rng.random_int() % (total - i);
    [indexes[total - i - 1], indexes[next_index]] = [
      indexes[next_index],
      indexes[total - i - 1],
    ];
  }
  return indexes;
}

export async function getRound(
  db: DatabaseReader,
  session: Session
): Promise<PokemonRound> {
  const indexes = seed_shuffled_indexes(session);
  const pokeId1 = indexes[session.offset];
  const pokeId2 = indexes[session.offset + 1];

  const getPoke = async (id: number) => {
    const poke = await db
      .table("pokemon")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (poke === null) {
      throw "pokemon not found?";
    }
    return poke;
  };
  const poke1 = await getPoke(pokeId1);
  const poke2 = await getPoke(pokeId2);
  return {
    firstPokemon: poke1,
    secondPokemon: poke2,
    round: [session.generation, session.offset],
  };
}

export default query(
  async ({ db }, session: number | null): Promise<PokemonRound | null> => {
    if (session === null) {
      return null;
    }
    const sessionObject: Session = await db
      .table("sessions")
      .filter((q) => q.eq(q.field("id"), session))
      .first();
    if (sessionObject === null) {
      throw `no such session ${session}`;
    }
    return await getRound(db, sessionObject);
  }
);
