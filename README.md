# Task Tracker CLI

Task Tracker CLI is a simple command-line tool for managing tasks. You can add, view, update, and remove tasks, with each task having a description, status, and timestamps. Tasks are stored locally in a JSON file.

## Features

- Add new tasks with descriptions
- View all tasks or filter by status (`todo`, `in-progress`, `done`)
- Update task descriptions or status
- Remove tasks by ID
- Data persisted in `db/tasks.json`

## Setup

1. **Install dependencies**

   ```sh
   pnpm install
   ```

2. **Run in development mode**

   ```sh
   pnpm dev
   ```

3. **Build for production**

   ```sh
   pnpm build
   ```

4. **Start the built app**

   ```sh
   pnpm start
   ```

## Usage

When you run the CLI, you'll be prompted to select an action:

- **Add task**: Enter a description to create a new task.
- **View tasks**: See all tasks or filter by status.
- **Update task**: Change a task's description or status.
- **Remove task**: Delete a task by its ID.
- **Exit**: Quit the program.

## Project Structure

- `src/` - Source code
- `db/tasks.json` - Task data (created automatically)
- `dist/` - Compiled output (after build)

## Requirements

- Node.js 24+
- [pnpm](https://pnpm.io/) package manager

---

Made by [plaingabriel](https://github.com/plaingabriel)

Project idea by [roadmap.sh](https://roadmap.sh/projects/task-tracker)
