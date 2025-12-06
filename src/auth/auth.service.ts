import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(registerUserDto: RegisterUserDto) {
        //1. Vemos si el usuario ya existe
        const existingUser = await this.prisma.user.findUnique({ where: { email: registerUserDto.email } });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        //2. Hasheamos la contraseña
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(registerUserDto.password, saltOrRounds);

        //3. Creamos el usuario
        const user = await this.prisma.user.create({
            data: {
                email: registerUserDto.email,
                password: hashedPassword,
                name: registerUserDto.name,
            },
        });

        return {
            success: true,
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    }

    async login(loginUserDto: LoginUserDto) {
        //1. Vemos si el usuario existe
        const existingUser = await this.prisma.user.findUnique({ where: { email: loginUserDto.email } });
        if (!existingUser) {
            throw new BadRequestException('User not found, please register first');
        }
        //2. Comparar contraseñas
        const passwordMatch = await bcrypt.compare(loginUserDto.password, existingUser.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //3. Generar token
        const token = this.jwtService.sign({ sub: existingUser.id });

        //4. Devuelve el usuario sin contraseña
        return {
            success: true,
            message: 'User logged in successfully',
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
            },
            token,
        }
    }
}