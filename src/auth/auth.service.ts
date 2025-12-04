import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async register(email: string, password: string, name: string) {
        const user = await this.prisma.user.create({
            data: {
                email,
                password,
                name,
            },
        });

        return user;
    }
}