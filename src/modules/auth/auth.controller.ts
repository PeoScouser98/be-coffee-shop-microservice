import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import { HttpResponse } from 'src/common/utils/http.utils';
import CatchError from 'src/decorators/catch-error.decorator';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserTokenService } from '../user-token/user-token.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly userTokenService: UserTokenService
	) {}

	@Post('signin')
	@CatchError()
	async signin(@Req() req, @Res() res) {
		const { data: user, error } = await this.authService.verifyUser(req.body);
		if (error) {
			throw new HttpException(error.message, error.statusCode);
		}
		const { privateKey, publicKey } = crypto.generateKeyPairSync(
			this.configService.get('crypto.type'),
			this.configService.get('crypto.options')
		);

		const { accessToken, refreshToken } = this.authService.generateTokenPair({
			payload: { _id: user._id, email: user.email },
			privateKey: privateKey
		});

		const response = new HttpResponse(
			{ user, accessToken, refreshToken },
			'Signed in successfully',
			HttpStatus.OK
		);
		return res.status(response.statusCode).json(response);
	}

	@Post('signout')
	@CatchError()
	async signout(@Req() req, @Res() res) {
		const { publicKey } = await this.userTokenService.getUserTokenByUserId(
			req.headers['x-client-id']
		);
		if (!publicKey)
			throw new HttpException('Không tìm thấy key', HttpStatus.NOT_FOUND);
		const payload = await this.jwtService.verifyAsync(
			req.headers.authorization.replace('Bearer ', ''),
			{
				publicKey
			}
		);

		const { data, error: findUserError } =
			await this.userService.findUserById(payload?._id);

		if (findUserError)
			throw new HttpException(
				findUserError.message,
				findUserError.statusCode
			);

		const { error: revokeTokenError } = await this.authService.revokeToken(
			data?._id
		);
		if (revokeTokenError)
			return res.status(revokeTokenError.statusCode).json(revokeTokenError);
		const response = new HttpResponse(
			null,
			'Đăng xuất thành công',
			HttpStatus.OK
		);
		return res.status(response.statusCode).json(response);
	}

	@Get('refresh-token')
	async refreshToken() {}
}
