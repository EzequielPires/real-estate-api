import { User } from "src/modules/users/entities/user.entity";

export class CreateTokenDto {
    refresh_token: string;
    user: User;
    expires_date: Date;
}
