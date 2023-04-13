import { PaginatedDto } from "src/dtos/paginated.dto";

export class FindLeadDto extends PaginatedDto {   
    realtorId?: string;   
    propertyId?: number;  
    propertyCode?: string; 
}