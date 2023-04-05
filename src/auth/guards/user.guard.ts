import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "src/enums/role.enum";

@Injectable()
export class UserGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const {id} = context.switchToHttp().getRequest().params;
        const {user} = context.switchToHttp().getRequest();

        console.log(user, id);

        if(user.role === Role.super_admin) return true;
        
        return user.id === id;
      }
}