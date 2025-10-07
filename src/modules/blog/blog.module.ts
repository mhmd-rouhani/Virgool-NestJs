import {Module} from '@nestjs/common';
import {BlogService} from './services/blog.service';
import {BlogController} from './controllers/blog.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {BlogEntity} from "./entities/blog.entity";
import {CategoryEntity} from "../category/entities/category.entity";
import {CategoryService} from "../category/category.service";
import {BlogCategoryEntity} from "./entities/blog-category.entity";
import {BlogLikesEntity} from "./entities/like.entity";
import {BlogBookmarkEntity} from "./entities/bookmark.entity";
import {BlogCommentService} from "./services/comment.service";
import {BlogCommentEntity} from "./entities/comment.entity";
import {CommentController} from "./controllers/comment.controller";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([
        BlogEntity,
        CategoryEntity,
        BlogCategoryEntity,
        BlogLikesEntity,
        BlogBookmarkEntity,
        BlogCommentEntity,
    ])
    ],
    controllers: [BlogController, CommentController],
    providers: [BlogService, CategoryService, BlogCommentService],
})
export class BlogModule {
}
