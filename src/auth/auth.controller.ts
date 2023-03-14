import {Controller, Post, UseGuards, Req} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(AuthGuard('localStrategy'))
    @Post()
    authUser(@Req() req: any) {
        return this.authService.login(req.user);
    }
}