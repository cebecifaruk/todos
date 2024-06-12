import Repository from "../ports/Repository";
import { createClient } from "redis";

class RedisRepository<T> implements Repository<T> {
  private readonly client;
  constructor(private readonly url: string) {
    this.client = createClient({ url });
  }

  async put(key: string, value: T) {
    await this.client.connect().catch(() => {});
    await this.client.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<T> {
    await this.client.connect().catch(() => {});
    return JSON.parse((await this.client.get(key)) || "") as T;
  }

  async delete(key: string) {
    await this.client.connect().catch(() => {});
    await this.client.del(key);
  }
}

export default RedisRepository;
