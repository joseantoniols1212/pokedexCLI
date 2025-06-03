import { State } from "./state.js";

export function cleanInput(input: string): string[] {
  const trimedInput =  input.toLocaleLowerCase().trim();
  if (trimedInput === "") return [];
  return trimedInput.split(/\s+/);
}

export async function startREPL(state: State) {
  state.readline.prompt();
  state.readline.on( "line", async (input) => {
    const parsedInput = cleanInput(input);
    if (parsedInput.length === 0) {
        state.readline.prompt();
    } else {
        let [commandName, ...args] = parsedInput;
        const command = state.commands[commandName];
        if (!command) {
          console.log("Unknown command")
        } else {
          try {
            await command.callback(state, ...args);
          } catch (err: unknown) {
            if (err instanceof Error) console.log(err.message);
            console.log("Unknown error")
          }
        }
    }
    state.readline.prompt();
  } )
}