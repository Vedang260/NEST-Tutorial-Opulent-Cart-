import { Controller, Post, Get, Put, Delete, Body, UsePipes, ValidationPipe, HttpStatus, HttpException, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() createUserDto: CreateUserDto){
        try {
            const response = await this.usersService.registerUser(createUserDto);
            return {
                success: true,
                message: response.message,
                user: response.user,
            };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) userId: number){
        try{
            const response = await this.usersService.deleteUser(userId);
            return {
                success: true,
                message: response.message,
            };
        }catch(error){
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
