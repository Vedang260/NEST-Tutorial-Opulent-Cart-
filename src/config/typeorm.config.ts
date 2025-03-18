import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import 'dotenv/config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'ecommerce_users',
  entities: [User],
  synchronize: true, // ❗ Set to false in production
  logging: true,
};
