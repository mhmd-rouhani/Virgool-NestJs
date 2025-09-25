import {Entity} from "typeorm";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {EntityNames} from "../../../common/enums/entity.enum";

@Entity(EntityNames.Comment)
export class CommentEntity extends BaseEntity {

}