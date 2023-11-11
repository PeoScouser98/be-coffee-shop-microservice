import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import { ServiceResult } from 'src/common/utils/http.utils';
import { AuthService } from '../auth/auth.service';
import { UserTokenDocument } from '../user-token/schemas/user-token.schema';
import { UserTokenService } from '../user-token/user-token.service';
import { UserDTO } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(
		@Inject('USER_REPOSITORY')
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
		private readonly userTokenService: UserTokenService
	) {}

	async createUser(payload: Omit<UserDTO, '_id'>) {
		const existedUser = await this.userRepository.findUserByEmail(
			payload.email
		);
		if (existedUser)
			return new ServiceResult(null, {
				message: 'Người dùng đã tồn tại',
				statusCode: HttpStatus.CONFLICT
			});

		const { privateKey, publicKey } = crypto.generateKeyPairSync(
			this.configService.get('crypto.type'),
			this.configService.get('crypto.options')
		);

		const newUser = await this.userRepository.createUser(payload);
		if (!newUser)
			return new ServiceResult(null, {
				message: 'Không tạo được user',
				statusCode: HttpStatus.BAD_REQUEST
			});

		const { accessToken, refreshToken } = this.authService.generateTokenPair({
			payload: { _id: newUser._id, email: newUser.email },
			privateKey: privateKey
		});

		const newUserToken = {
			user: newUser._id,
			publicKey: publicKey.toString(),
			refreshToken: [refreshToken]
		} as UserTokenDocument;

		await this.userTokenService.createUserToken(newUserToken);

		return new ServiceResult(
			{ user: newUser, accessToken, refreshToken },
			null
		);
	}

	async findUserById(userId: string) {
		const user = await this.userRepository.findOneById(userId);
		if (!user)
			return new ServiceResult(null, {
				message: 'Không tìm thấy người dùng',
				statusCode: HttpStatus.NOT_FOUND
			});
		return new ServiceResult(user, null);
	}
}
