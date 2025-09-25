import {ApiPropertyOptional} from "@nestjs/swagger";

export class PaginatedDto {
    @ApiPropertyOptional({type: "integer"})
    page: number;
    @ApiPropertyOptional({type: "integer"})
    limit: number;
}