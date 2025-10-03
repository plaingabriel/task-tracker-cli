import { input, select } from "@inquirer/prompts";

type InputConfig = {
  message: string;
  required?: boolean;
};

interface SelectOption<T> {
  message: string;
  choices: { name: string; value: T }[];
}

export async function createSelect<T>({
  message,
  choices,
}: SelectOption<T>): Promise<T> {
  return select({
    message: message,
    choices: choices,
  });
}

export async function createInput(inputConfig: InputConfig): Promise<string> {
  return input(inputConfig);
}
