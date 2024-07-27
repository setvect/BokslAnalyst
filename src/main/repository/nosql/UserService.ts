import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// 데이터 타입 정의
type User = {
  id: number;
  name: string;
  email: string;
};

type Schema = {
  users: User[];
};

export default class UserService {
  private db;

  constructor() {
    const adapter = new JSONFile<Schema>('db_aaaaaaaaaaaa.json');
    this.db = new Low(adapter, { users: [] });
  }

  async createUser(name: string, email: string): Promise<User> {
    const newUser: User = {
      id: this.db.data.users.length + 1,
      name,
      email,
    };
    this.db.data.users.push(newUser);
    await this.db.write();
    return newUser;
  }

  async readUser(id: number): Promise<User | undefined> {
    return this.db.data.users.find((user) => user.id === id);
  }

  async updateUser(id: number, name?: string, email?: string): Promise<User | undefined> {
    const user = this.db.data.users.find((user) => user.id === id);
    if (user) {
      if (name) user.name = name;
      if (email) user.email = email;
      await this.db.write();
    }
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.db.data.users.length;
    this.db.data.users = this.db.data.users.filter((user) => user.id !== id);
    if (this.db.data.users.length < initialLength) {
      await this.db.write();
      return true;
    }
    return false;
  }
}
