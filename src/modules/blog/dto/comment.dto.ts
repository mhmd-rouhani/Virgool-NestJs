import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNumber, IsNumberString, IsOptional, Length} from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    @Length(5)
    text: string

    @ApiProperty()
    @IsNumberString()
    blog_id: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    parent_id: number;
}