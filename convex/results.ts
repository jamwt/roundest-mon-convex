import { Pokemon, VoteResults } from "../src/protocol";
import { query } from "./_generated/server";

const generateCountPercent = (pokemon: Pokemon) => {
  const { votesFor, totalVotes } = pokemon;
  if (totalVotes === 0) {
    return 0;
  }
  return (votesFor / totalVotes) * 100;
};

export default query(async ({ db }): Promise<VoteResults> => {
  const pokemon = await db.table("pokemon").collect();
  var results: VoteResults = [];
  for (const poke of pokemon) {
    results.push({
      pokemon: poke,
      percent: generateCountPercent(poke),
    });
  }
  results.sort((a, b) => {
    const delta = b.percent - a.percent;
    return delta !== 0 ? delta : b.pokemon.votesFor - a.pokemon.votesFor;
  });
  return results;
});
