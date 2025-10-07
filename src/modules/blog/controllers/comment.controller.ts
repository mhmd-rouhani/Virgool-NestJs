import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../../auth/guards/Auth.guard";
import {SwaggerConsumes} from "../../../common/enums/swagger-consumes.enum";
import {BlogCommentService} from "../services/comment.service";
import {CreateCommentDto} from "../dto/comment.dto";

@Controller("blog-comment")
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly blogCommentService: BlogCommentService) {
    }

    @Post()
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    create(@Body() createCommentDto: CreateCommentDto) {
        return this.blogCommentService.create(createCommentDto);

    }
}