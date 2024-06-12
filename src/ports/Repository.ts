export interface Repository<T> {
  put(key:string, value:T): Promise<void>
  get(key:string): Promise<T>
  delete(key:string): Promise<void>
}

export default Repository;