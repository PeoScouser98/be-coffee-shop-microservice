import { Inject, Injectable } from '@nestjs/common';
import { UserTokenDocument } from './schemas/user-token.schema';
import { UserTokenRepository } from './user-token.repository';

@Injectable()
export class UserTokenService {
	constructor(
		@Inject('USER_TOKEN_REPOSITORY')
		private readonly userTokenRepository: UserTokenRepository
	) {}
	async createUserToken(payload: UserTokenDocument) {
		return await this.userTokenRepository.createOne(payload);
	}
	async getUserTokenByUserId(userId: string) {
		return await this.userTokenRepository.findOneByUserId(userId);
	}
}
