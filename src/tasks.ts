import fs from "fs/promises";
import { type Task, type TaskStatus } from "./types.ts";

const folderPath = "./db";
const filePath = `${folderPath}/tasks.json`;

function createNewTaskId(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 1;
  }

  const lastTask = tasks[tasks.length - 1];

  if (!lastTask) {
    return 1;
  }

  return lastTask.id + 1;
}

export async function checkDirExisting(): Promise<void> {
  try {
    await fs.access(folderPath);
  } catch (error) {
    // If the directory doesn't exist, create it
    await fs.mkdir(folderPath);
  }
}

export async function checkFileExisting(): Promise<void> {
  try {
    await fs.access(filePath);
  } catch (error) {
    // If the file doesn't exist, create it
    await fs.writeFile(filePath, "[]");
  }
}

export async function getTasks(): Promise<Task[]> {
  const data = await fs.readFile(filePath);
  const tasks: Task[] = JSON.parse(data.toString());

  return tasks;
}

export async function addTask(taskDescription: string): Promise<void> {
  const tasks = await getTasks();
  const newTaskId = createNewTaskId(tasks);

  const newTask: Task = {
    id: newTaskId,
    description: taskDescription,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  console.log(`Adding task: ${taskDescription}`);

  await fs.writeFile(filePath, JSON.stringify(tasks));
  console.log("Task added successfully!");
}

export async function updateTaskDescription(
  taskId: number,
  taskDescription: string
): Promise<void> {
  const tasks = await getTasks();
  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (taskToUpdate) {
    taskToUpdate.description = taskDescription;
    taskToUpdate.updatedAt = new Date().toISOString();

    console.log(`Updating task with ID ${taskId}`);

    await fs.writeFile(filePath, JSON.stringify(tasks));

    console.log("Task updated successfully!");
    return;
  }

  console.log(`Task with ID ${taskId} not found.`);
}

export async function deleteTask(taskId: number): Promise<void> {
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    console.log(`Deleting task with ID ${taskId}`);

    await fs.writeFile(filePath, JSON.stringify(tasks));
    console.log("Task deleted successfully!");

    return;
  }

  console.log(`Task with ID ${taskId} not found.`);
}

export async function updateTaskStatus(
  taskId: number,
  newTaskStatus: TaskStatus
): Promise<void> {
  const tasks = await getTasks();
  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (taskToUpdate) {
    taskToUpdate.status = newTaskStatus;
    taskToUpdate.updatedAt = new Date().toISOString();

    console.log(`Updating task with ID ${taskId}`);

    await fs.writeFile(filePath, JSON.stringify(tasks));

    console.log("Task updated successfully!");
    return;
  }

  console.log(`Task with ID ${taskId} not found.`);
}
