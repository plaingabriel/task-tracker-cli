import chalk from "chalk";
import { Table } from "console-table-printer";
import { parseISOStringToDate } from "./lib.ts";
import { createInput, createSelect } from "./prompts.ts";
import {
  addTask,
  checkFileExisting,
  deleteTask,
  getTasks,
  updateTaskDescription,
  updateTaskStatus,
} from "./tasks.ts";
import type { Task, TaskStatus } from "./types.ts";

type MainMenuOptions = "add" | "view" | "update" | "remove" | "exit";
type UpdateOption = "description" | "status" | "back";
type ViewOption = "all" | "back" | TaskStatus;

console.log("Task Tracker CLI");
console.log("What do you want to do?");

async function selectMainMenuOptions(): Promise<MainMenuOptions> {
  return createSelect({
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

async function selectUpdateOption(): Promise<UpdateOption> {
  return createSelect({
    message: "Select an option: ",
    choices: [
      { name: "Update description", value: "description" },
      { name: "Update status", value: "status" },
      { name: "Back", value: "back" },
    ],
  });
}

async function selectUpdateStatus(): Promise<TaskStatus> {
  return createSelect({
    message: "Select a status: ",
    choices: [
      { name: "To Do", value: "todo" },
      { name: "In Progress", value: "in-progress" },
      { name: "Done", value: "done" },
    ],
  });
}

async function selectViewOption(): Promise<ViewOption> {
  return createSelect({
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

async function inputTaskDescription(): Promise<string> {
  return createInput({
    message: "Enter the task description: ",
    required: true,
  });
}

async function inputTaskId(): Promise<number> {
  const taskId = createInput({
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

export async function mainMenu() {
  await checkFileExisting();

  while (true) {
    const mainOptionSelected = await selectMainMenuOptions();

    switch (mainOptionSelected) {
      case "add":
        const taskDescription = await inputTaskDescription();
        await addTask(taskDescription);
        break;

      case "view":
        const tasks = await getTasks();
        await viewTasksMenu(tasks);
        break;

      case "update":
        await updateTaskMenu();
        break;

      case "remove":
        const taskIdToRemove = await inputTaskId();
        await deleteTask(taskIdToRemove);
        break;

      case "exit":
        console.log("Exiting the program...");
        process.exit(0);
    }
  }
}

export async function updateTaskMenu() {
  const taskId = await inputTaskId();

  while (true) {
    const updateOption = await selectUpdateOption();

    switch (updateOption) {
      case "description":
        const taskDescription = await inputTaskDescription();
        await updateTaskDescription(taskId, taskDescription);
        break;

      case "status":
        const newTaskStatus = await selectUpdateStatus();
        await updateTaskStatus(taskId, newTaskStatus);
        break;

      case "back":
        return;
    }
  }
}

export async function viewTasksMenu(tasks: Task[]) {
  while (true) {
    const viewOption = await selectViewOption();

    if (viewOption === "back") {
      return;
    }

    await viewTasks(tasks, viewOption);
  }
}

export async function viewTasks(tasks: Task[], status: ViewOption) {
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  const columns = [
    {
      name: "id",
      title: "ID",
    },
    {
      name: "description",
      title: "Description",
    },
    {
      name: "status",
      title: "Status",
    },
    {
      name: "createdAt",
      title: "Created At",
    },
    {
      name: "updatedAt",
      title: "Updated At",
    },
  ];

  const table = new Table({
    columns: columns.map((column) => ({
      name: column.name,
      title: chalk.bold.green(column.title),
      alignment: "left",
    })),
    filter: (row) => status === "all" || row.status === status,
  });

  Promise.all(
    tasks.map(async (task) => {
      const description = task.description;
      const status = task.status;
      const createdAt = await parseISOStringToDate(task.createdAt);
      const updatedAt = await parseISOStringToDate(task.updatedAt);

      table.addRow({
        id: task.id,
        description: description,
        status: status,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    })
  ).then(() => {
    table.printTable();
  });
}
