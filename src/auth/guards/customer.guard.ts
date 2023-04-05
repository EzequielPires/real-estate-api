import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "src/enums/role.enum";

@Injectable()
export class CustomerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const {user} = context.switchToHttp().getRequest();
        
        return user.role === Role.customer;
      }
}