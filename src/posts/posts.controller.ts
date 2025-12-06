import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Put,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostsDto } from './dto/filter-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Req() req) {
        const post = await this.postsService.create(createPostDto, req.user.id);
        return { success: true, message: 'Post created successfully', data: post };
    }

    @UseGuards(JwtAuthGuard)
    @Post('bulk')
    async createMany(@Body() posts: CreatePostDto[], @Req() req) {
        const post = await this.postsService.createMany(posts, req.user.id);
        return { success: true, message: 'Posts created successfully', data: post };
    }


    @Get()
    async findAll(@Query() filters: FilterPostsDto) {
        const posts = await this.postsService.findAll(filters);
        return { success: true, message: 'Posts found successfully', ...posts };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const post = await this.postsService.findOne(+id);
        return { success: true, message: 'Post found successfully', data: post };
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req
    ) {
        const post = await this.postsService.update(+id, updatePostDto, req.user.id);
        return { success: true, message: 'Post updated successfully', data: post };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req) {
        const post = await this.postsService.remove(+id, req.user.id);
        return { success: true, message: 'Post deleted successfully', data: post };
    }

}
