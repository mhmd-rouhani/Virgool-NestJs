import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {BlogEntity} from "./blog.entity";
import {CategoryEntity} from "../../category/entities/category.entity";

@Entity(EntityNames.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
    @Column()
    blog_id: number;
    @Column()
    category_id: number;

    @ManyToOne(
        () => BlogEntity,
        blog => blog.categories,
        {onDelete: 'CASCADE'}
    )
    @JoinColumn({ name: 'blog_id' })
    blog: BlogEntity;

    @ManyToOne(
        () => CategoryEntity,
        category => category.blog_categories,
        {onDelete: 'CASCADE'}
    )
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;
}