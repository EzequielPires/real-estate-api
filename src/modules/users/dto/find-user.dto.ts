import { PaginatedDto } from "src/dtos/paginated.dto";
import { Role } from "src/enums/role.enum";

export class FindUserDto extends PaginatedDto {
    role: Role;
    name: string;
}