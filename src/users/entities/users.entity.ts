import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
    CUSTOMER = 'customer',
    VENDOR = 'vendor',
    ADMIN = 'admin'
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
    role: UserRole;
    
    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    otp: string;
}