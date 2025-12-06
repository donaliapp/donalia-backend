import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/(?=.*\d)/, {
        message: 'Password must contain at least one number',
    })
    password: string;
}
