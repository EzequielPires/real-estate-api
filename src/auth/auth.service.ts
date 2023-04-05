import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        try {
            const { user } = await this.usersService.findOneByEmail(email);

            const passwordMatch = compareSync(pass, user.password);

            if (!passwordMatch) {
                throw new Error('Email ou senha inválida!');
            }

            const { password, ...result } = user;
            return result;
        } catch (error) {
            return null;
        }
    }

    async login(user: any) {
        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
            token: this.jwtService.sign(payload),
        };
    }
}