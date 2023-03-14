import { ApiProperty } from "@nestjs/swagger";

export class PaginatedDto {
    @ApiProperty()
    limit: number;

    @ApiProperty()
    page: number;
  }
  