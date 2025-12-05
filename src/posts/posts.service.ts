import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePostDto, authorId: number) {
        const post = await this.prisma.post.create({
            data: {
                ...data,
                authorId,
            },
        });
        return post;
    }

    async findAll() {
        const posts = await this.prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return posts;
    }

    async findOne(id: number) {
        const post = await this.prisma.post.findUnique({
            where: {
                id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }

    async update(id: number, data: UpdatePostDto, userId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('You are not authorized to update this post');
        }

        const updatedPost = await this.prisma.post.update({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            data,
        });
        return updatedPost;
    }

    async remove(id: number, userId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('You are not authorized to delete this post');
        }

        await this.prisma.post.delete({
            where: { id },
        });

        return {
            message: 'Post deleted successfully',
            post,
        };
    }
}
