import chalk from "chalk";
import { Table } from "console-table-printer";
import { parseISOStringToDate } from "./lib.ts";
import {
  inputTaskDescription,
  inputTaskId,
  selectMainMenuOptions,
  selectOptionUpdate,
  selectStatusUpdate,
  selectViewOption,
} from "./prompts.ts";
import {
  addTask,
  checkFileExisting,
  deleteTask,
  getTasks,
  updateTaskDescription,
  updateTaskStatus,
} from "./tasks.ts";
import type { Task, TaskStatus } from "./types.ts";

type ViewOption = "all" | "back" | TaskStatus;

console.log("Task Tracker CLI");
console.log("What do you want to do?");

async function updateTaskMenu() {
  const taskId = await inputTaskId();

  while (true) {
    const updateOption = await selectOptionUpdate();

    switch (updateOption) {
      case "description":
        const taskDescription = await inputTaskDescription();
        await updateTaskDescription(taskId, taskDescription);
        break;

      case "status":
        const newTaskStatus = await selectStatusUpdate();
        await updateTaskStatus(taskId, newTaskStatus);
        break;

      case "back":
        return;
    }
  }
}

async function viewTasksMenu(tasks: Task[]) {
  while (true) {
    const viewOption = await selectViewOption();

    if (viewOption === "back") {
      return;
    }

    await viewTasks(tasks, viewOption);
  }
}

async function viewTasks(tasks: Task[], status: ViewOption) {
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
