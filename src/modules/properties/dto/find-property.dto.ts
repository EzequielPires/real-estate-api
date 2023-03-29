import { PaginatedDto } from "src/dtos/paginated.dto";
import { AdType, Status } from "src/enums/property.enum";

export class FindPropertyDto extends PaginatedDto {
    cityId: number;
    districtId: number;
    stateId: number;

    realtorId: number;
    code: string;
    adType: AdType;
    typeId: string;
    status: Status;
    emphasis: string;

    priceMin: string;
    priceMax: string;
}