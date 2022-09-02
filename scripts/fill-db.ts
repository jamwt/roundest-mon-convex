import { POKEMON_COUNT } from "../src/protocol";
import { PokemonClient } from "pokenode-ts";

import { convexHttpClient } from "../src/backend/convex";

const doBackfill = async () => {
  const pokeApi = new PokemonClient();
  const convex = convexHttpClient();

  const allPokemon = await pokeApi.listPokemons(0, POKEMON_COUNT);

  const formattedPokemon = allPokemon.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
    totalVotes: 0,
    votesFor: 0,
  }));

  const insertPokemon = convex.mutation("insertPokemon");
  const batchSize = 5;
  for (var i = 0; i < formattedPokemon.length; i += batchSize) {
    await insertPokemon(formattedPokemon.slice(i, i + batchSize));
  }
};

doBackfill();
