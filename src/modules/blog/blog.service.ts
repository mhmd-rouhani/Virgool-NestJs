import {ConflictException, Inject, Injectable, Scope} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BlogEntity} from "./entities/blog.entity";
import {Repository} from "typeorm";
import {CreateBlogDto} from "./dto/blog.dto";
import {createSlug, randomId} from "../../common/utils/functions";
import {REQUEST} from "@nestjs/core";
import type {Request} from "express";
import {ConflictMessage, PublicMessage} from "../../common/enums/message.enum";
import {find} from "rxjs";
import {PaginatedDto} from "../../common/dtos/pagination.dto";
import {paginationGenerator, paginationSolver} from "../../common/utils/pagination.util";

@Injectable({scope: Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
        @Inject(REQUEST) private request: Request
    ) {
    }

    async create(createBlogDto: CreateBlogDto) {
        const {id: author_id} = this.request.user
        const {title, slug, content, time_for_study, description, image} = createBlogDto

        const titleExists = await this.checkBlogByTitle(title)
        if (titleExists) {
            throw new ConflictException(ConflictMessage.BlogTitle)
        }

        let finalSlug = createSlug(slug ? slug : title)

        const slugExists = await this.checkBlogBySlug(finalSlug)
        if (slugExists) {
            finalSlug += `-${randomId()}`
        }

        const blog = this.blogRepository.create({
            title,
            slug: finalSlug,
            content,
            time_for_study,
            description,
            image,
            author_id,
        })

        await this.blogRepository.save(blog)

        return {message: PublicMessage.Created}
    }

    async myBlogs() {
        const {id} = this.request.user
        return await this.blogRepository.find({
                where: {
                    author_id: id
                },
                order: {
                    id: "DESC"
                }
            }
        )
    }

    async blogList(paginationDto: PaginatedDto) {
        const {page, limit, skip} = paginationSolver(paginationDto)

        const [blogs, count] = await this.blogRepository.findAndCount({
            order: {id: "DESC"},
            skip,
            take: limit
        })

        return {
            pagination: paginationGenerator(count, page, limit),
            blogs,
        }
    }

    async checkBlogBySlug(slug: string) {
        return await this.blogRepository.findOneBy({slug})
    }

    async checkBlogByTitle(title: string) {
        return await this.blogRepository.findOneBy({title})
    }

}
