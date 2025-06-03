import { createInterface, type Interface } from "node:readline";
import { getCommands } from "./commands.js";
import { PokeAPI, Pokemon } from "./pokeAPI.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
    readline: Interface,
    commands: Record<string, CLICommand>,
    pokeapi: PokeAPI,
    nextLocationsURL?: string,
    prevLocationsURL?: string,
    pokedex: Record<string, Pokemon>
}

export function initState() {
    return {
        readline: createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "Pokedex > "
            }),
        commands: getCommands(),
        pokeapi: new PokeAPI(),
        pokedex: {}
    }
}
