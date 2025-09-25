import {Column, Entity} from "typeorm";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {EntityNames} from "../../../common/enums/entity.enum";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @Column()
    image: string;

    @Column()
    author_id: string;
}