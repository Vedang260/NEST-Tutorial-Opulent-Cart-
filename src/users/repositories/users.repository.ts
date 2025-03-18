import { DataSource, Repository } from "typeorm";
import { User } from "../entities/users.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager()); // Pass User entity & EntityManager
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.create(user);
    return await this.save(newUser);
  }

  async deleteUser(userId: number){
    return await this.delete({ id: userId });
  }
}
