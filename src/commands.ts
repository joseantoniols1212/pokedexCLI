import { ShallowLocations, Location, Pokemon } from "./pokeAPI.js";
import type { CLICommand, State } from "./state.js";

export async function commandExit(state: State) {
    console.log("Closing the Pokedex... Goodbye!");
    state.readline.close();
    process.exit(0);
}

export async function commandHelp(state: State) {
  console.log("Welcome to the Pokedex!\nUsage:\n");
  for (const commandName in state.commands) {
    const command = state.commands[commandName];
    console.log(`${command.name}: ${command.description}`)
  }
}

export async function commandMap(state: State) {
  const locations: ShallowLocations = await state.pokeapi.fetchLocations(state.nextLocationsURL);
  for (const location of locations.results) {
    console.log(location.name);
  }
  state.nextLocationsURL = locations.next;
  state.prevLocationsURL = locations.previous;
}

export async function commandMapB(state: State) {
  if (!state.prevLocationsURL) {
    console.log("You're on the first page");
    return;
  }
  const locations: ShallowLocations = await state.pokeapi.fetchLocations(state.prevLocationsURL);
  for (const location of locations.results) {
    console.log(location.name);
  }
  state.nextLocationsURL = locations.next;
  state.prevLocationsURL = locations.previous;
}

export async function commandExplore(state: State, locationName: string) {
  if (!locationName) {
    console.log("You're to select an area to explore!");
    return;
  }
  console.log(`Exploring ${locationName}...`)
  const location: Location = await state.pokeapi.fetchLocation(locationName);
  const pokemonNames = location.pokemon_encounters.map((e) => e.pokemon.name );
  console.log("Found Pokemon:");
  for (const name of pokemonNames) {
    console.log(` - ${name}`);
  }
}

export async function commandCatch(state: State, pokemonName: string) {
  const pokemon: Pokemon = await state.pokeapi.fetchPokemon(pokemonName);
  console.log(`Throwing a Pokeball at ${pokemonName}...`)
  const baseExperience = pokemon.base_experience;
  const MAX_BASE_EXPERIENCE = 200
  const catchingProb = baseExperience/MAX_BASE_EXPERIENCE;
  if (catchingProb < Math.random()) {
    console.log(`${pokemonName} was caught!`)
    state.pokedex[pokemonName] = pokemon;
  } else {
    console.log(`${pokemonName} escaped!`)
  }
}

export async function commandInspect(state: State, pokemonName: string) {
  const pokemon: Pokemon | undefined = state.pokedex[pokemonName];
  if (!pokemon) {
    console.log("you have not caught that pokemon");
    return;
  }
  console.log(`Name: ${pokemonName}`);
  console.log(`Height: ${pokemon.height}`);
  console.log(`Weight: ${pokemon.weight}`);
  console.log(`Stats:`);
  for (const stat of pokemon.stats) {
    console.log(` - ${stat.stat.name}: ${stat.base_stat}`)
  }
  console.log(`Types:`);
  for (const type of pokemon.types) {
    console.log(` - ${type.type.name}`);
  }
}

export async function commandPokedex(state: State) {
  console.log("Your pokedex:")
  for (const key in state.pokedex) {
    console.log(` - ${key}`)
  }
}

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: "exit",
      description: "Exits the pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
    map: {
      name: "map",
      description: "Shows the next 20 locations",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description: "Shows the previous 20 locations",
      callback: commandMapB,
    },
    explore: {
      name: "explore",
      description: "explore <location>. Shows the pokemons that can be found in <location>.",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "catch <pokemon>. Tries to catch the pokemon selected.",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect",
      description: "inspect <pokemon>. Inspect the selected pokemon if you have already catched it.",
      callback: commandInspect,
    },
    pokedex: {
      name: "pokedex",
      description: "List all the captured pokemons.",
      callback: commandPokedex,
    },
  };
}