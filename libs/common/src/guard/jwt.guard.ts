import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserTokenService } from 'apps/user/src/services/user-token.service'

import { Request } from 'express'

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private userTokenService: UserTokenService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const token = this.extractTokenFromHeader(request)
		if (!token) {
			throw new UnauthorizedException()
		}
		try {
			const { data: userToken } = await this.userTokenService.getUserTokenByUserId(
				request.cookies.client_id
			)
			if (!userToken) throw new UnauthorizedException()

			const payload = await this.jwtService.verifyAsync(token, {
				publicKey: userToken.public_key
			})
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request.user = payload
		} catch {
			throw new UnauthorizedException()
		}
		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		return request.cookies.access_token
	}
}
