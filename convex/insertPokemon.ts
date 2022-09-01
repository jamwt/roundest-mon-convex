// myMutationFunction.ts
import { DatabaseReader, DatabaseWriter, mutation } from "./_generated/server";
import { Pokemon } from "../src/schema";

async function insertOnePokemon(
  db: DatabaseWriter,
  newPokemon: Pokemon
): Promise<boolean> {
  const existing = await db
    .table("pokemon")
    .filter((q) => q.eq(q.field("id"), newPokemon.id))
    .first();

  if (existing) {
    console.log("Tried to insert existing pokemon");
    return false;
  }
  db.insert("pokemon", newPokemon);
  return true;
}

export default mutation(async ({ db }, newPokemon: Pokemon[]) => {
  for (const poke of newPokemon) {
    if (await insertOnePokemon(db, poke)) {
      //console.log(`Inserted ${poke.name}`);
    } else {
      //console.log(`${poke.name} already exists`);
    }
  }
});
