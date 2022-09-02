export type Pokemon = {
  id: number;
  name: string;
  spriteUrl: string;

  // Voting stats.
  totalVotes: number;
  votesFor: number;
  _id?: any;
};

export type Session = {
  id: number;
  generation: number;
  offset: number;
  _id?: any;
};

export type PokemonRound = {
  firstPokemon: Pokemon;
  secondPokemon: Pokemon;
  round: [number, number];
};

export type VoteResults = {
  pokemon: Pokemon;
  percent: number;
}[];

export const POKEMON_COUNT = 493;
