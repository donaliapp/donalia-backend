// src/posts/dto/filter-posts.dto.ts
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PostCategory } from '@prisma/client';

export class FilterPostsDto {
    @IsOptional()
    @IsEnum(PostCategory, { message: 'category must be a valid PostCategory' })
    category?: PostCategory;

    @IsOptional()
    @IsString({ message: 'location must be a string' })
    location?: string;

    // Para búsquedas por texto en título/descr.
    @IsOptional()
    @IsString({ message: 'search must be a string' })
    search?: string;

    // rewardMin y rewardMax como números enteros (transformados por class-transformer)
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'rewardMin must be an integer' })
    @Min(0)
    rewardMin?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'rewardMax must be an integer' })
    @Min(0)
    rewardMax?: number;

    // Paginación
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    // Orden: 'desc' o 'asc' sobre createdAt o rewardAmount
    @IsOptional()
    @IsString()
    orderBy?: 'createdAt' | 'rewardAmount' = 'createdAt';

    @IsOptional()
    @IsString()
    orderDir?: 'asc' | 'desc' = 'desc';
}
