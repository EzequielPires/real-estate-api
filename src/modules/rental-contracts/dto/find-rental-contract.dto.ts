import { PaginatedDto } from "src/dtos/paginated.dto";

export class FindRentalContractDto extends PaginatedDto {
    code: string;
}