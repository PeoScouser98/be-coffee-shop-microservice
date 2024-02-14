import { ROLES } from '@app/common/decorators/roles.decorator'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const roles: Array<string> = this.reflector.getAllAndOverride(ROLES, [
			context.getHandler(),
			context.getClass()
		])
		const request = context.switchToHttp().getRequest()
		return roles.includes(request.user.role)
	}
}
