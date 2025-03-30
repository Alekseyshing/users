interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

class UserStore {
  private users: User[] = [];

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.users.push(newUser);
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }
}

export const userStore = new UserStore(); 