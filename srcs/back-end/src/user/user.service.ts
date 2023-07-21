import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()

export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: 'bob',
      password: 'bob123',
    },
    {
      userId: 2,
      username: 'bob1',
      password: 'bob123',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}