import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserTokenService } from 'apps/auth/src/services/user-token.service'
import { Request } from 'express'
import { Log } from '../helpers/log.helper'

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
			throw new UnauthorizedException('Access token is required')
		}
		try {
			const { data, error } = await this.userTokenService.getUserTokenByUserId(
				request.cookies.client_id
			)
			if (error) throw new UnauthorizedException(error.message)
			const publicKey = Buffer.from(data.public_key)
			const payload = this.jwtService.verify(token, {
				publicKey
			})
			request.user = payload
		} catch (e) {
			Log.error(e.message)
			throw new UnauthorizedException(e.message)
		}
		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		return request.cookies.access_token
	}
}
