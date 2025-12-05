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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Req() req) {
        return this.postsService.create(createPostDto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.postsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.postsService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req
    ) {
        return this.postsService.update(+id, updatePostDto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req) {
        return this.postsService.remove(+id, req.user.id);
    }

}
