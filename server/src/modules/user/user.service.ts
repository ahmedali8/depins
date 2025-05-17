import { Injectable } from '@nestjs/common';

import { User } from 'src/database';

@Injectable()
export class UserService {
  async createUser(input: Partial<User>): Promise<User> {
    await User.insert(input);

    return this.find({ id: input.id }); // Save the user instance to the database
  }

  async updateUser(id: number, input: Partial<User>): Promise<boolean> {
    await User.update({ id }, input);

    return true;
  }

  findById(id: number) {
    return User.findOne({
      where: { id },
    });
  }

  find(input: Partial<User>) {
    const query: any = {};

    if (input.id) {
      query.id = input.id;
    } else if (input.id) {
      query.id = input.id;
    }

    return User.findOne({
      where: query,
    });
  }

  findAll() {
    return User.find();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
