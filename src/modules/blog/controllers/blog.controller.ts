import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {BlogService} from '../services/blog.service';
import {CreateBlogDto, FilterBlogDto, UpdateBlogDto} from "../dto/blog.dto";
import {ApiBearerAuth, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {SwaggerConsumes} from "../../../common/enums/swagger-consumes.enum";
import {AuthGuard} from "../../auth/guards/Auth.guard";
import {Auth} from "../../../common/decorators/auth.decorator";
import {Pagination} from "../../../common/decorators/pagination.decorator";
import {PaginatedDto} from "../../../common/dtos/pagination.dto";
import {SkipAuth} from "../../../common/decorators/skip-auth.decorator";
import {FilterBlog} from "../../../common/decorators/filter.decorator";

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
    @FilterBlog()
    find(@Query() paginationDto: PaginatedDto, @Query() filterBlogDto: FilterBlogDto) {
        return this.blogService.blogList(paginationDto, filterBlogDto)
    }

    @Delete(":id")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    delete(@Param('id') id: number) {
        return this.blogService.delete(id);
    }

    @Put("/:id")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    update(@Param("id", ParseIntPipe) id: number, @Body() blogDto: UpdateBlogDto) {
        return this.blogService.update(id, blogDto)
    }

    @Get("/like/:id")
    likeToggle(@Param('id', ParseIntPipe) id: number) {
        return this.blogService.likeToggle(id)
    }

    @Get("/bookmark/:id")
    bookmarkToggle(@Param('id', ParseIntPipe) id: number) {
        return this.blogService.bookmarkToggle(id)
    }


}
