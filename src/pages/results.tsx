import type { GetServerSideProps } from "next";

import Image from "next/image";
import Head from "next/head";
import { Pokemon, VoteResults } from "@/protocol";
import { useQuery } from "../../convex/_generated/react";

const PokemonListing: React.FC<{
  pokemon: { pokemon: Pokemon; percent: number };
  rank: number;
}> = ({ pokemon, rank }) => {
  return (
    <div className="relative flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center pl-4">
          <Image
            src={pokemon.pokemon.spriteUrl}
            width={64}
            height={64}
            layout="fixed"
          />
          <div className="pl-2 capitalize">{pokemon.pokemon.name}</div>
        </div>
      </div>
      <div className="pr-4">{pokemon.percent.toFixed(2) + "%"}</div>
      <div className="absolute top-0 left-0 z-20 flex items-center justify-center px-2 font-semibold text-white bg-gray-600 border border-gray-500 shadow-lg rounded-br-md">
        {rank}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{}> = () => {
  const pokemon: VoteResults | undefined = useQuery("results");
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Roundest Pokemon Results</title>
      </Head>
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {pokemon &&
          pokemon.map((currentPokemon, index) => {
            return (
              <PokemonListing
                pokemon={currentPokemon}
                key={index}
                rank={index + 1}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ResultsPage;
