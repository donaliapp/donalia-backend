import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(email: string, password: string, name: string) {
        //1. Vemos si el usuario ya existe
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        //2. Hasheamos la contraseña
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);

        //3. Creamos el usuario
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
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

    async login(email: string, password: string) {
        //1. Vemos si el usuario existe
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            throw new BadRequestException('User not found, please register first');
        }
        //2. Comparar contraseñas
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
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