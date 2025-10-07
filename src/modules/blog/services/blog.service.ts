import {BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BlogEntity} from "../entities/blog.entity";
import {FindOptionsWhere, Repository} from "typeorm";
import {CreateBlogDto, FilterBlogDto, UpdateBlogDto} from "../dto/blog.dto";
import {createSlug, randomId} from "../../../common/utils/functions";
import {REQUEST} from "@nestjs/core";
import type {Request} from "express";
import {BadRequestMessage, ConflictMessage, NotFoundMessage, PublicMessage} from "../../../common/enums/message.enum";
import {find} from "rxjs";
import {PaginatedDto} from "../../../common/dtos/pagination.dto";
import {paginationGenerator, paginationSolver} from "../../../common/utils/pagination.util";
import {isArray} from "class-validator";
import {CategoryEntity} from "../../category/entities/category.entity";
import {CategoryService} from "../../category/category.service";
import {BlogCategoryEntity} from "../entities/blog-category.entity";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BlogLikesEntity} from "../entities/like.entity";
import {BlogBookmarkEntity} from "../entities/bookmark.entity";
import {CreateCommentDto} from "../dto/comment.dto";

@Injectable({scope: Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private readonly blogCategoryRepository: Repository<BlogCategoryEntity>,
        @InjectRepository(BlogLikesEntity) private readonly blogLikeRepository: Repository<BlogLikesEntity>,
        @InjectRepository(BlogBookmarkEntity) private readonly blogBookmarkRepository: Repository<BlogBookmarkEntity>,
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
                relations: {
                    categories: {
                        category: true
                    }
                },
                where: {
                    author_id: id,
                },
                select: {
                    categories: {
                        id: true,
                        category: {
                            id: true,
                            title: true
                        }
                    }
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
            .leftJoin("blog.author", "author")
            .leftJoin("author.profile", "profile")
            .addSelect(['categories.id', 'category.title', 'author.username', "author.id", "profile.nick_name"])
            .where(where, {category, search})
            .loadRelationCountAndMap("blog.likes", "blog.likes")
            .loadRelationCountAndMap("blog.bookmarks", "blog.bookmarks")
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

    async update(id: number, updateBlogDto: UpdateBlogDto) {
        let {title, slug, content, time_for_study, description, image, categories} = updateBlogDto

        const blog = await this.blogRepository.findOneBy({id})

        if (blog) {
            if (!isArray(categories) && typeof categories === "string") {
                categories = categories.split(",")
            } else if (!isArray(categories)) {
                throw new BadRequestException(BadRequestMessage.InvalidCategories);
            }

            let slugData: any = null
            if (title) {
                slugData = title
                blog.title = title
            }

            if (slug) {
                slugData = slug
            }

            if (slugData) {
                slug = createSlug(slugData)
                const isExist = await this.checkBlogBySlug(slug)
                if (isExist && isExist.id !== id) {
                    slug += `-${randomId()}`
                }
                blog.slug = slug
            }

            if (description) {
                blog.description = description
            }

            if (content) {
                blog.content = content
            }

            if (image) {
                blog.image = image
            }

            if (time_for_study) {
                blog.time_for_study = time_for_study
            }

            await this.blogRepository.save(blog)

            if (categories && isArray(categories) && categories.length > 0) {
                await this.blogCategoryRepository.delete({blog_id: blog.id})
            }

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

            return {message: PublicMessage.Updated}
        }

        throw new NotFoundException(NotFoundMessage.NotFoundPost)

    }

    async likeToggle(id: number) {
        const {id: author_id} = this.request.user
        const blog = await this.blogRepository.findOneBy({id})

        if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost)
        let message = PublicMessage.Like
        const isLiked = await this.blogLikeRepository.findOneBy({user_id: author_id, blog_id: blog.id})
        if (isLiked) {
            await this.blogLikeRepository.delete(({id: isLiked.id}))
            message = PublicMessage.DisLike
        } else {
            await this.blogLikeRepository.insert({
                blog_id: blog.id,
                user_id: author_id,
            })
        }

        return {
            message
        }

    }

    async bookmarkToggle(blogId: number) {
        const {id: userId} = this.request.user

        const blog = await this.blogRepository.findOneBy({id: blogId})
        if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost)

        const existingBookmark = await this.blogBookmarkRepository.findOneBy({
            user_id: userId,
            blog_id: blogId,
        })

        if (existingBookmark) {
            await this.blogBookmarkRepository.delete({id: existingBookmark.id})
            return {message: PublicMessage.DisBookmark}
        }

        await this.blogBookmarkRepository.insert({
            blog_id: blogId,
            user_id: userId,
        })

        return {message: PublicMessage.Bookmark}
    }

}
