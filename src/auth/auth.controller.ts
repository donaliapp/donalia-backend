import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiThrottle } from 'src/common/decorators/throttle.decorator';

const ttl = 60;
const limit = 5;
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiThrottle()
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @ApiThrottle()
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @ApiThrottle()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req) {
        return {
            success: true,
            user: req.user,
        };
    }
}
