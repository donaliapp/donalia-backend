import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    PostsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,   // segundos
          limit: 10, // 10 peticiones por minuto por IP
        },
      ],
    }),
  ],
})
export class AppModule { }
