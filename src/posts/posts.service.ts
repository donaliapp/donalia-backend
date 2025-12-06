import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostsDto } from './dto/filter-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) { }

    // CREAR POST
    async create(data: CreatePostDto, authorId: number) {
        const post = await this.prisma.post.create({
            data: {
                ...data,
                authorId,
            },
        });

        return post;
    }

    async createMany(posts: CreatePostDto[], authorId: number) {
        const data = posts.map(post => ({
            ...post,
            authorId,
        }));

        const result = await this.prisma.post.createMany({
            data,
        });

        return result;
    }

    // LISTAR CON FILTROS + PAGINACIÓN
    async findAll(filters?: FilterPostsDto) {
        const {
            category,
            location,
            search,
            rewardMin,
            rewardMax,
            page = 1,
            limit = 10,
            orderBy = 'createdAt',
            orderDir = 'desc',
        } = filters || {};

        const where: any = {
            ...(category && { category }),

            ...(location && {
                location: {
                    contains: location,
                    mode: 'insensitive',
                },
            }),

            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),

            ...(rewardMin !== undefined && {
                rewardAmount: {
                    ...(rewardMax !== undefined
                        ? { gte: Number(rewardMin), lte: Number(rewardMax) }
                        : { gte: Number(rewardMin) }),
                },
            }),

            ...(rewardMax !== undefined &&
                rewardMin === undefined && {
                rewardAmount: {
                    lte: Number(rewardMax),
                },
            }),
        };

        const skip = (page - 1) * limit;
        const take = limit;

        const [items, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take,
                orderBy: { [orderBy]: orderDir },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit) || 1,
            },
        };
    }

    // OBTENER UNO POR ID
    async findOne(id: number) {
        const post = await this.prisma.post.findUnique({
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
        });

        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        return post;
    }

    // ACTUALIZAR POST
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
            data,
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

        return updatedPost;
    }

    // ELIMINAR POST
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

        return post; // Devuelves el eliminado por si el front lo necesita
    }
}
