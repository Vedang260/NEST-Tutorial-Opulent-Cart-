import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from '../repositories/users.repository';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async registerUser(createUserDto: CreateUserDto){
        try{
            // check if user already exists
            const existingUser = await this.usersRepository.findByEmail(createUserDto.email);

            if(existingUser){
                throw new ConflictException('Email already exists');
            }

            // hashing the password before storing
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            createUserDto.password = hashedPassword;

            // Generate OTP
            const otp = await this.generateOTP();
            const otpExpiration = new Date();
            otpExpiration.setMinutes(otpExpiration.getMinutes() + 5); // OTP valid for 5 minutes
            
            // creating a new user with OTP
            const newUser = await this.usersRepository.createUser({
                ...createUserDto,
                otp,
                otpExpiration,
            });

            // send OTP via email
            await this.sendOTPEmail(newUser.email, otp);
            return {
                message: 'User registered successfully. Verify OTP sent to Email.',
                user: newUser
            };
        }catch(error){
            throw error;
        }
    }

    async generateOTP(): Promise<string>{
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        return otp;
    }

    async sendOTPEmail(email: string, otp: string){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"Opulent Cart" <${process.env.EMAIL_USER}>`, // Set a friendly sender name
            to: email,
            subject: '🔐 Your OTP for Registration - Opulent Cart',
            html: `
              <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #333;">Welcome to <span style="color: #ff6600;">Opulent Cart</span> 🛍️</h2>
                  <p style="font-size: 16px; color: #666;">Thank you for registering! Use the OTP below to complete your verification:</p>
                  
                  <div style="background: #ff6600; color: white; font-size: 22px; font-weight: bold; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                    ${otp}
                  </div>
          
                  <p style="font-size: 14px; color: #999; margin-top: 10px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          
                  <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
                  <p style="font-size: 12px; color: #888;">Need help? <a href="mailto:support@opulentcart.com" style="color: #ff6600; text-decoration: none;">Contact Support</a></p>
                </div>
              </div>
            `,
          });          
    }

    async deleteUser(userId: number){
        try{
            await this.usersRepository.deleteUser(userId);
            return {
                message: 'User deleted successfully'
            }
        }catch(error){
            throw error;
        }
    }
}
