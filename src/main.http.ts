import express from "express";
import TodoService, { Todo } from "./services/TodoService";
import FileRepository from "./adapters/FileRepository";
import RedisRepository from "./adapters/RedisRepository";

const app = express();

app.use(express.json());

class TodoController {
  constructor(private readonly todoService: TodoService) {}

  async create(req: express.Request, res: express.Response) {
    try {
      const { title } = req.body;

      const todo = await this.todoService.create(title);

      // Create a new todo
      return res.status(200).json(todo);
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      else return res.status(500).json({ error: "An error occurred" });
    }
  }

  async read(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;

      const todo = await this.todoService.read(Number(id));

      return res.status(200).json(todo);
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      else return res.status(500).json({ error: "An error occurred" });
    }
  }

  async update(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;

      const todo = await this.todoService.update(Number(id), title, completed);

      return res.status(200).json(todo);
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      else return res.status(500).json({ error: "An error occurred" });
    }
  }

  async delete(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;

      await this.todoService.delete(Number(id));

      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
      else return res.status(500).json({ error: "An error occurred" });
    }
  }

  getRouter(): express.Router {
    const router = express.Router();

    router.post("/", (req, res) => this.create(req, res));
    router.get("/:id", (req, res) => this.read(req, res));
    router.put("/:id", (req, res) => this.update(req, res));
    router.delete("/:id", (req, res) => this.delete(req, res));

    return router;
  }
}

// Create repositories
// const todoRepository = new FileRepository<Todo>("./todos.json");
const todoRepository = new RedisRepository<Todo>("redis://localhost:6379");

// Create services
const todoService = new TodoService(todoRepository);

// Create controllers
const todoController = new TodoController(todoService);

app.use("/todos", todoController.getRouter());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
