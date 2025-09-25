import {applyDecorators} from "@nestjs/common";
import {ApiQuery} from "@nestjs/swagger";

export const Pagination = () => {
    return applyDecorators(
        ApiQuery({name: "limit", example: 10                             }),
        ApiQuery({name: "page", example: 1})
    )
}