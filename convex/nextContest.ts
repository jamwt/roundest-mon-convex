// myQueryFunction.ts
import { query } from "./_generated/server";
import mt from "mersenne-twister";
import _ from "lodash";
import { Pokemon, PokemonRound, POKEMON_COUNT, Session } from "../src/schema";

function seed_shuffled_indexes(seed: number, generation: number): number[] {
  var indexes = [];
  for (var i = 0; i < POKEMON_COUNT; i++) {
    indexes.push(i + 1);
  }
  const total = indexes.length;
  var rng = new mt([seed, generation]);
  for (var i = 0; i < total; i++) {
    const next_index = rng.random_int() % (total - i);
    [indexes[total - i - 1], indexes[next_index]] = [
      indexes[next_index],
      indexes[total - i - 1],
    ];
  }
  return indexes;
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
    const indexes = seed_shuffled_indexes(session, sessionObject.generation);
    const pokeId1 = indexes[sessionObject.guesses];
    const pokeId2 = indexes[sessionObject.guesses + 1];

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
      round: [sessionObject.generation, sessionObject.guesses],
    };
  }
);
