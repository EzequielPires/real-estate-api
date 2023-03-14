import { Role } from "src/enums/role.enum";

export class CreateUserDto {
    id?: string;

    name: string;

    email: string;

    password: string;

    phone: string;

    role?: Role;
}
