import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../entities/users.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string; 

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @IsStrongPassword()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}