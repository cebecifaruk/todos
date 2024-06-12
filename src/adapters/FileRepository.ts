import Repository from "../ports/Repository";
import fs from "fs";

class FileRepository<T> implements Repository<T> {
  constructor(private readonly path: string) {
    // Check the existence of the file
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify({}));
    }
  }

  async put(key: string, value: T) {
    const db = await fs.promises.readFile(this.path, "utf-8").then(JSON.parse);
    db[key] = value;
    await fs.promises.writeFile(this.path, JSON.stringify(db));
  }

  async get(key: string): Promise<T> {
    const db = await fs.promises.readFile(this.path, "utf-8").then(JSON.parse);
    if (key in db) return db[key];
    else throw new Error("Key not found");
  }

  async delete(key: string) {
    const db = await fs.promises.readFile(this.path, "utf-8").then(JSON.parse);
    delete db[key];
    await fs.promises.writeFile(this.path, JSON.stringify(db));
  }
}

export default FileRepository;
