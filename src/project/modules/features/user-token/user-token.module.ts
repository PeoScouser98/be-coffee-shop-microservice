import { Global, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { UserToken, UserTokenSchema } from './schemas/user-token.schema'
import { UserTokenController } from './user-token.controller'
import { UserTokenRepository } from './user-token.repository'
import { UserTokenService } from './user-token.service'
import Providers from '@/project/common/constants/provide.constant'

const COLLECTION_NAME = 'user_tokens'

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: UserToken.name,
				schema: UserTokenSchema
			}
		])
	],
	providers: [
		UserTokenService,
		JwtService,
		{
			provide: Providers.USER_TOKEN_REPOSITORY,
			useClass: UserTokenRepository
		}
	],
	controllers: [UserTokenController],
	exports: [
		UserTokenService,
		{
			provide: Providers.USER_TOKEN_REPOSITORY,
			useClass: UserTokenRepository
		}
	]
})
export class UserTokenModule {}
