import { PaginatedDto } from "src/dtos/paginated.dto";

export class FindInvoiceDto extends PaginatedDto {
    tenantId?: string;
    locatorId?: string;
    rentalContractId?: number;
    start?: string;
    end?: string;
}