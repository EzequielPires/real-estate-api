import {Controller, Post, UseGuards, Req} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CustomerGuard } from "./guards/customer.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post()
    authUser(@Req() req: any) {
        return this.authService.login(req.user);
    }

    @UseGuards(LocalAuthGuard, CustomerGuard)
    @Post('customer')
    authCustomer(@Req() req: any) {
        return this.authService.login(req.user);
    }
}