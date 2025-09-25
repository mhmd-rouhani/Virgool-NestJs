import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, ParseIntPipe} from '@nestjs/common';
import {CategoryService} from './category.service';
import {CreateCategoryDto} from './dto/create-category.dto';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {ApiConsumes, ApiQuery, ApiTags} from "@nestjs/swagger";
import {SwaggerConsumes} from "../../common/enums/swagger-consumes.enum";
import {PaginatedDto} from "../../common/dtos/pagination.dto";
import {Pagination} from "../../common/decorators/pagination.decorator";

@Controller('category')
@ApiTags('Category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }

    @Post()
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @Pagination()
    findAll(@Query() paginationDto: PaginatedDto) {
        return this.categoryService.findAll(paginationDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(+id);
    }

    @Put(':id')
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.remove(id);
    }
}
