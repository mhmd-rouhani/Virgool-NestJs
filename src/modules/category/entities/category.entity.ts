import {Column, Entity, OneToMany} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {BlogCategoryEntity} from "../../blog/entities/blog-category.entity";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
    @Column()
    title: string;

    @Column({nullable: true})
    priority: number;

    @OneToMany(
        () => BlogCategoryEntity,
        blog => blog.category
    )
    blog_categories: BlogCategoryEntity[];
}
