import { input, select } from "@inquirer/prompts";
import type { TaskStatus } from "./types.ts";

type MainMenuOptions = "add" | "view" | "update" | "remove" | "exit";
type UpdateOption = "description" | "status" | "back";
type ViewOption = "all" | "back" | TaskStatus;

export async function selectMainMenuOptions(): Promise<MainMenuOptions> {
  return select({
    message: "Select an option: ",
    choices: [
      { name: "Add task", value: "add" },
      { name: "View tasks", value: "view" },
      { name: "Update task", value: "update" },
      { name: "Remove task", value: "remove" },
      { name: "Exit", value: "exit" },
    ],
  });
}

export async function selectOptionUpdate(): Promise<UpdateOption> {
  return select({
    message: "Select an option: ",
    choices: [
      { name: "Update description", value: "description" },
      { name: "Update status", value: "status" },
      { name: "Back", value: "back" },
    ],
  });
}

export async function selectStatusUpdate(): Promise<TaskStatus> {
  return select({
    message: "Select a status: ",
    choices: [
      { name: "To Do", value: "todo" },
      { name: "In Progress", value: "in-progress" },
      { name: "Done", value: "done" },
    ],
  });
}

export async function selectViewOption(): Promise<ViewOption> {
  return select({
    message: "Select an option: ",
    choices: [
      { name: "All tasks", value: "all" },
      { name: "To Do", value: "todo" },
      { name: "In Progress", value: "in-progress" },
      { name: "Done", value: "done" },
      { name: "Back", value: "back" },
    ],
  });
}

export async function inputTaskDescription(): Promise<string> {
  return input({
    message: "Enter the task description: ",
    required: true,
  });
}

export async function inputTaskId(): Promise<number> {
  const taskId = input({
    message: "Enter the task ID: ",
    required: true,
  });

  try {
    const parsedTaskId = parseInt(await taskId);
    return parsedTaskId;
  } catch (error) {
    console.error("Invalid task ID. Please enter a valid number.");
    return await inputTaskId();
  }
}
