import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsDefined,
} from 'class-validator';
import { PostCategory } from '@prisma/client';

export class CreatePostDto {
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @IsDefined({ message: 'category is required' })
    @IsEnum(PostCategory, { message: 'category must be a valid PostCategory' })
    category: PostCategory;

    @IsOptional()
    @IsNumber({}, { message: 'rewardAmount must be a number' })
    rewardAmount?: number;

    @IsOptional()
    @IsString({ message: 'location must be a string' })
    location?: string;
}
