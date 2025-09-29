import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {BlogService} from './blog.service';
import {CreateBlogDto} from "./dto/blog.dto";
import {ApiBearerAuth, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {SwaggerConsumes} from "../../common/enums/swagger-consumes.enum";
import {AuthGuard} from "../auth/guards/Auth.guard";
import {Auth} from "../../common/decorators/auth.decorator";
import {Pagination} from "../../common/decorators/pagination.decorator";
import {PaginatedDto} from "../../common/dtos/pagination.dto";
import {SkipAuth} from "../../common/decorators/skip-auth.decorator";

@Controller('blog')
@ApiTags('Blog')
@Auth()
export class BlogController {
    constructor(private readonly blogService: BlogService) {

    }

    @Post()
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    create(@Body() createBlogDto: CreateBlogDto) {
        return this.blogService.create(createBlogDto);
    }

    @Get("/my")
    myBlogs() {
        return this.blogService.myBlogs()
    }

    @Get()
    @SkipAuth()
    @Pagination()
    find(@Query() paginationDto: PaginatedDto) {
        return this.blogService.blogList(paginationDto)
    }
}
