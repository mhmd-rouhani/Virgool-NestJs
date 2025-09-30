import {Module} from '@nestjs/common';
import {BlogService} from './blog.service';
import {BlogController} from './blog.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {BlogEntity} from "./entities/blog.entity";
import {CategoryEntity} from "../category/entities/category.entity";
import {CategoryService} from "../category/category.service";
import {BlogCategoryEntity} from "./entities/blog-category.entity";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([BlogEntity, CategoryEntity, BlogCategoryEntity])],
    controllers: [BlogController],
    providers: [BlogService, CategoryService],
})
export class BlogModule {
}
