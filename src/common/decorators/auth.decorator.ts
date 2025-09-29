import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {AuthGuard} from "../../modules/auth/guards/Auth.guard";

export function Auth() {
    return applyDecorators(
        ApiBearerAuth('Authorization'),
        UseGuards(AuthGuard),
    );
}
