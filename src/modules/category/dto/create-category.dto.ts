import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({
        example: ""
    })
    title: string;

    @ApiPropertyOptional({type: "integer"})
    priority: number
}

