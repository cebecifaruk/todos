#!/usr/bin/env ts-node

import TodoService, { Todo } from "./services/TodoService";
import FileRepository from "./adapters/FileRepository";
import RedisRepository from "./adapters/RedisRepository";

const args = process.argv.slice(2);

// const todoRepository = new FileRepository<Todo>("./todos.json");
const todoRepository = new RedisRepository<Todo>("redis://localhost:6379");

const todoService = new TodoService(todoRepository);

async function main() {
  switch (args[0]) {
    case "create": {
      const result = await todoService.create(args[1]);
      console.log(result);
      break;
    }
    case "read": {
      const result = await todoService.read(Number(args[1]));
      console.log(result);
      break;
    }
    case "update": {
      const result = await todoService.update(Number(args[1]), args[2], args[3] === "true");
      break;
    }
    case "delete": {
      const result = await todoService.delete(Number(args[1]));
      break;
    }
    default:
      console.log("Invalid command");
      break;
  }
}

main();
