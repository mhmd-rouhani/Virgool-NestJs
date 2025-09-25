import {Entity} from "typeorm";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {EntityNames} from "../../../common/enums/entity.enum";

@Entity(EntityNames.Bookmark)
export class BookmarkEntity extends BaseEntity {

}