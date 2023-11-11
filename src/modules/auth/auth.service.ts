import { UserTokenRepository } from './../user-token/user-token.repository';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';
import { HttpResponse, ServiceResult } from 'src/common/utils/http.utils';
import { UserDTO } from '../user/dto/user.dto';
import { UserRepository } from './../user/user.repository';
import { UserTokenService } from '../user-token/user-token.service';
import { KeyObject } from 'node:crypto';

@Injectable()
export class AuthService {
	constructor(
		@Inject('USER_TOKEN_REPOSITORY')
		private readonly userTokenRepository: UserTokenRepository,
		@Inject('USER_REPOSITORY')
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService // private readonly userTokenService: UserTokenService
	) {}

	async verifyUser(payload: Pick<UserDTO, 'email' | 'password'>) {
		const user = await this.userRepository.findUserByEmail(payload.email);
		if (!user)
			return new ServiceResult(null, {
				message: 'Không tìm thấy người dùng',
				statusCode: HttpStatus.NOT_FOUND
			});
		return new ServiceResult(user, null);
	}

	async revokeToken(userId: string) {
		const deletedUserToken =
			await this.userTokenRepository.deleteByUserId(userId);
		if (!deletedUserToken)
			return new ServiceResult(false, {
				message: 'Không tìm thấy người dùng',
				statusCode: HttpStatus.NOT_FOUND
			});
		return new ServiceResult(true, null);
	}

	generateTokenPair({
		payload,
		privateKey
	}: {
		payload: Pick<UserDTO, '_id' | 'email'>;
		privateKey: string;
	}) {
		const accessToken = this.jwtService.sign(payload, {
			privateKey: privateKey,
			algorithm: this.configService.get<Algorithm>('jwt.algorithm'),
			expiresIn: this.configService.get<string>('jwt.accessTokenExpires')
		});
		const refreshToken = this.jwtService.sign(payload, {
			privateKey: privateKey,
			algorithm: this.configService.get<Algorithm>('jwt.algorithm'),
			expiresIn: this.configService.get<string>('jwt.refreshTokenExpires')
		});

		return { accessToken, refreshToken };
	}
}
