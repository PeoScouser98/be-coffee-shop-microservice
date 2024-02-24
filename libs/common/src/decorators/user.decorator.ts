import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IUser } from 'apps/auth/src/interfaces/user.interface'

export const CurrentUser = createParamDecorator((data: keyof IUser, ctx: ExecutionContext) => {
	const request = (() => {
		if (ctx.getType() === 'http') {
			return ctx.switchToHttp().getRequest()
		}
		if (ctx.getType() === 'rpc') {
			return ctx.switchToRpc().getData()
		}
	})()

	const user = request.user

	return data ? user[data] : user
})
