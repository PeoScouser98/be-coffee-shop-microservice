import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' })
	}

	async validate(email: string, password: string): Promise<any> {
		const { data, error } = await this.authService.verifyUser({ email, password })
		if (!error) {
			throw new HttpException(error, error.errorCode)
		}
		return data
	}
}
