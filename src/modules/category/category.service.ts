import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateCategoryDto} from './dto/create-category.dto';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "./entities/category.entity";
import {ILike, Repository} from "typeorm";
import {ConflictMessage, NotFoundMessage, PublicMessage} from "../../common/enums/message.enum";
import {raw} from "express";
import {PaginatedDto} from "../../common/dtos/pagination.dto";
import {paginationGenerator, paginationSolver} from "../../common/utils/pagination.util";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    ) {
    }

    async create(createCategoryDto: CreateCategoryDto) {
        const {title, priority} = createCategoryDto;
        await this.checkExistByTitle(title)
        const category = this.categoryRepository.create({
            title,
            priority,
        })
        await this.categoryRepository.save(category);

        return {
            message: PublicMessage.Created
        }
    }

    async insertByTitle(title: string) {
        const category = this.categoryRepository.create({title})
        return await this.categoryRepository.save(category);
    }

    async findAll(paginationDto: PaginatedDto) {
        const {page, limit, skip} = paginationSolver(paginationDto);
        const [categories, count] = await this.categoryRepository.findAndCount({
            skip,
            take: limit,
        });

        return {
            categories,
            pagination: paginationGenerator(count, page, limit),
        }
    }

    async findOne(id: number) {
        const category = await this.categoryRepository.findOneBy({id})
        if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory)

        return category
    }

    async findOneByTitle(title: string) {
        return await this.categoryRepository.findOneBy({title})
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.findOne(id)
        const {title, priority} = updateCategoryDto
        await this.categoryRepository.update(category.id, {title, priority})
        return {
            message: PublicMessage.Updated
        }
    }

    async remove(id: number) {
        const category = await this.findOne(id)
        await this.categoryRepository.delete(category.id)
        return {
            message: PublicMessage.Deleted
        }

    }

    async checkExistByTitle(title: string) {
        title = title.trim()?.toLowerCase()
        const exist = await this.categoryRepository.existsBy({title: ILike(title)})
        if (exist) {
            throw new ConflictException(ConflictMessage.CategoryTitle)
        }
    }


}
