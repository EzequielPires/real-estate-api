import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginatedDto } from "src/dtos/paginated.dto";

export class FindBannersDto extends PaginatedDto {
    @ApiPropertyOptional()
    realEstateId: string;

    @ApiPropertyOptional()
    bannerTypeId: number;
}