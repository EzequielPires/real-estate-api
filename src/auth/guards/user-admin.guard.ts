import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "src/enums/role.enum";

@Injectable()
export class UserAdminGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const {user} = context.switchToHttp().getRequest();
        console.log(user);
        
        return user.role === Role.super_admin || user.role === Role.admin;
      }
}