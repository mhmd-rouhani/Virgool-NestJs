import {Inject, Injectable, NotFoundException, Scope} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {BlogEntity} from "../entities/blog.entity";
import {BlogCommentEntity} from "../entities/comment.entity";
import {REQUEST} from "@nestjs/core";
import {BlogService} from "./blog.service";
import {CreateCommentDto} from "../dto/comment.dto";
import {Repository} from "typeorm";
import {NotFoundMessage, PublicMessage} from "../../../common/enums/message.enum";
import type {Request} from "express";

@Injectable({scope: Scope.REQUEST})
export class BlogCommentService {

    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCommentEntity) private blogCommentRepository: Repository<BlogCommentEntity>,
        @Inject(REQUEST) private request: Request,
        private blogService: BlogService,
    ) {
    }

    async create(commentDto: CreateCommentDto) {
        const {text, parent_id, blog_id} = commentDto
        const {id} = this.request.user

        const blog = await this.blogRepository.findOneBy({id: blog_id})
        if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost)

        let parent: BlogCommentEntity | null = null
        if (parent_id && !isNaN(parent_id)) {
            parent = await this.blogCommentRepository.findOneBy({id: +parent_id})
        }

        await this.blogCommentRepository.insert({
            text,
            accepted: true,
            blog_id,
            parent_id: parent ? parent_id : null,
            user_id: id
        })

        return {
            message: PublicMessage.CreatedComment
        }

    }
}