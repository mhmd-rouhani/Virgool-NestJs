import {PaginatedDto} from "../dtos/pagination.dto";

export const paginationSolver = (paginationDto: PaginatedDto) => {
    let {page = 1, limit = 10} = paginationDto;

    const skip = (page - 1) * limit

    return {
        page,
        limit,
        skip
    }

}

export const paginationGenerator = (count: number, page: number, limit: number) => {
    return {
        totalCount: count,
        page: +page,
        limit: +limit,
        pageCount: Math.ceil(count / limit),
    }
}