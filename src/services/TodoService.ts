import Repository from "../ports/Repository";
import assert from "assert";

export interface Todo {
  id: number,
  title: string,
  completed: boolean
}

class TodoService {
  constructor(private readonly todos: Repository<Todo>) {}


  async create(title: string) {
    assert(title, "Title is required");
    assert(title.length > 3, "Title must be at least 3 characters long");
    assert(title.length < 100, "Title must be less than 100 characters long");

    const todo = {
      id: Date.now(),
      title,
      completed: false
    };

    await this.todos.put(todo.id.toString(), todo);

    return todo;
  }

  async read(id:number) {
    return this.todos.get(id.toString());
  }

  async update(id:number, title:string | null, completed:boolean | null) {
    const todo = await this.todos.get(id.toString());
    if (title) todo.title = title;
    if (completed) todo.completed = completed;

    await this.todos.put(id.toString(), todo);

    return todo;
  }

  async delete(id:number) {
    await this.todos.delete(id.toString());
  }

}

export default TodoService;