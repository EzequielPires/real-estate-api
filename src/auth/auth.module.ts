import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/modules/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            privateKey: 'YXNkY2RrZnVlYmFzamJkYXNsa2ZmZHNoZ3BvamFzZGZqaWhhb2RpamZpYWJzZGZpam5zYWRrbA==',
            signOptions: { expiresIn: '86400s' },
        }),
        UsersModule
    ],
    controllers: [AuthController],
    providers: [
        LocalStrategy,
        JwtStrategy,
        JwtAuthGuard,
        AuthService
    ]
})
export class AuthModule {}