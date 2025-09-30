import {BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BlogEntity} from "./entities/blog.entity";
import {FindOptionsWhere, Repository} from "typeorm";
import {CreateBlogDto, FilterBlogDto} from "./dto/blog.dto";
import {createSlug, randomId} from "../../common/utils/functions";
import {REQUEST} from "@nestjs/core";
import type {Request} from "express";
import {BadRequestMessage, ConflictMessage, NotFoundMessage, PublicMessage} from "../../common/enums/message.enum";
import {find} from "rxjs";
import {PaginatedDto} from "../../common/dtos/pagination.dto";
import {paginationGenerator, paginationSolver} from "../../common/utils/pagination.util";
import {isArray} from "class-validator";
import {CategoryEntity} from "../category/entities/category.entity";
import {CategoryService} from "../category/category.service";
import {BlogCategoryEntity} from "./entities/blog-category.entity";
import {EntityNames} from "../../common/enums/entity.enum";

@Injectable({scope: Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private readonly blogCategoryRepository: Repository<BlogCategoryEntity>,
        @Inject(REQUEST) private request: Request,
        private categoryService: CategoryService
    ) {
    }

    async create(createBlogDto: CreateBlogDto) {
        const {id: author_id} = this.request.user
        let {title, slug, content, time_for_study, description, image, categories} = createBlogDto

        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(BadRequestMessage.InvalidCategories);
        }

        const titleExists = await this.checkBlogByTitle(title)
        if (titleExists) {
            throw new ConflictException(ConflictMessage.BlogTitle)
        }

        let finalSlug = createSlug(slug ? slug : title)

        const slugExists = await this.checkBlogBySlug(finalSlug)
        if (slugExists) {
            finalSlug += `-${randomId()}`
        }

        let blog = this.blogRepository.create({
            title,
            slug: finalSlug,
            content,
            time_for_study,
            description,
            image,
            author_id,
        })

        blog = await this.blogRepository.save(blog)

        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category) {
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.blogCategoryRepository.insert({
                blog_id: blog.id,
                category_id: category.id
            })
        }

        return {message: PublicMessage.Created}
    }

    async myBlogs() {
        const {id} = this.request.user
        return await this.blogRepository.find({
                relations: ['categories'],
                where: {
                    author_id: id
                },
                order: {
                    id: "DESC"
                }
            }
        )
    }

    async blogList(paginationDto: PaginatedDto, filterBlogDto: FilterBlogDto) {
        const {page, limit, skip} = paginationSolver(paginationDto)
        let {category, search} = filterBlogDto

        let where = ''
        if (category) {
            category = category.toLowerCase()
            if (where.length > 0) where += " AND "
            where += 'category.title = LOWER(:category)'
        }

        if (search) {
            if (where.length > 0) where += " AND "
            search = `%${search.toLowerCase()}%`
            where += "CONCAT(blog.title, blog.description, blog.content) ILIKE :search"
        }

        const [blogs, count] = await this.blogRepository
            .createQueryBuilder(EntityNames.Blog)
            .leftJoin("blog.categories", "categories")
            .leftJoin("categories.category", "category")
            .addSelect(['categories.id', 'category.title'])
            .where(where, {category, search})
            .orderBy("blog.id", "DESC")
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        // const [blogs, count] = await this.blogRepository.findAndCount({
        //     relations: {
        //         categories: {
        //             category: true
        //         }
        //     },
        //     where,
        //     select: {
        //         categories: {
        //             id: true,
        //             category: {
        //                 id: true,
        //                 title: true
        //             }
        //         }
        //     },
        //     order: {id: "DESC"},
        //     skip,
        //     take: limit
        // })

        return {
            blogs,

            pagination: paginationGenerator(count, page, limit),
        }
    }

    async checkBlogBySlug(slug: string) {
        return await this.blogRepository.findOneBy({slug})
    }

    async checkBlogByTitle(title: string) {
        return await this.blogRepository.findOneBy({title})
    }

    async delete(id: number) {
        const blog = await this.blogRepository.findOneBy({id})

        if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost)

        return {
            message: PublicMessage.Deleted
        }
    }

}
