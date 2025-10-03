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
  checkDirExisting,
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
  const filteredTasks = tasks.filter((task) => {
    if (status === "all") {
      return true;
    }

    return task.status === status;
  });

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  const mappedTasks = await Promise.all(
    filteredTasks.map(async (task) => {
      return {
        id: task.id,
        description: task.description,
        status: task.status,
        createdAt: await parseISOStringToDate(task.createdAt),
        updatedAt: await parseISOStringToDate(task.updatedAt),
      };
    })
  );

  console.table(mappedTasks);
}

export async function mainMenu() {
  await checkDirExisting();
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
