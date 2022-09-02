import type React from "react";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "../../convex/_generated/react";
import { Pokemon } from "@/schema";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  const [session, setSession] = useState(null as null | number);
  const [submittedRound, setSubmittedRound] = useState(
    null as null | [number, number]
  );
  const pokemonRound = useQuery("nextContest", session);

  const voteMutation = useMutation("rate");
  const initRatingSession = useMutation("initRatingSession");
  const plausible = usePlausible();

  const voteForRoundest = (selected: number) => {
    if (!pokemonRound) return; // Early escape to make Typescript happy

    setSubmittedRound(pokemonRound.round);
    if (selected === pokemonRound?.firstPokemon.id) {
      voteMutation(1, session!, pokemonRound.round);
    } else {
      voteMutation(2, session!, pokemonRound.round);
    }
    plausible("cast-vote");
  };
  useEffect(() => {
    var sessionData = window.localStorage.getItem("roundest-mon-session");
    if (sessionData === null) {
      var sessionNumber = Math.floor(Math.random() * 999999999);
      sessionData = JSON.stringify(sessionNumber);
      window.localStorage.setItem("roundest-mon-session", sessionData);
    }
    const snum: number = JSON.parse(sessionData);
    const background = async () => {
      await initRatingSession(snum);
      setSession(snum);
    };
    background();
  }, [initRatingSession, setSession]);
  const fetchingNext =
    session === null || submittedRound === pokemonRound?.round;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <Head>
        <title>Roundest Pokemon</title>
      </Head>
      <div className="text-2xl text-center pt-8">Which Pokémon is Rounder?</div>
      {pokemonRound && (
        <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
          <PokemonListing
            pokemon={pokemonRound.firstPokemon}
            vote={() => voteForRoundest(pokemonRound.firstPokemon.id)}
            disabled={fetchingNext}
          />
          <div className="p-8 italic text-xl">{"or"}</div>
          <PokemonListing
            pokemon={pokemonRound.secondPokemon}
            vote={() => voteForRoundest(pokemonRound.secondPokemon.id)}
            disabled={fetchingNext}
          />
          <div className="p-2" />
        </div>
      )}
      {!pokemonRound && <img src="/rings.svg" className="w-48" />}
      <div className="w-full text-xl text-center pb-2">
        <a href="https://twitter.com/t3dotgg">Twitter</a>
        <span className="p-4">{"-"}</span>
        <Link href="/results">
          <a>Results</a>
        </Link>
        <span className="p-4">{"-"}</span>
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </div>
  );
}

const PokemonListing: React.FC<{
  pokemon: Pokemon;
  vote: () => void;
  disabled: boolean;
}> = (props) => {
  return (
    <div
      className={`flex flex-col items-center transition-opacity ${
        props.disabled && "opacity-0"
      }`}
      key={props.pokemon.id}
    >
      <div className="text-xl text-center capitalize mt-[-0.5rem]">
        {props.pokemon.name}
      </div>
      <Image
        src={props.pokemon.spriteUrl}
        width={256}
        height={256}
        layout="fixed"
        className="animate-fade-in"
      />
      <button
        className={btn}
        onClick={() => props.vote()}
        disabled={props.disabled}
      >
        Rounder
      </button>
    </div>
  );
};
