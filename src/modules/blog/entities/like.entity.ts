import {Entity} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";

@Entity(EntityNames.Like)
export class LikeEntity extends BaseEntity {

}