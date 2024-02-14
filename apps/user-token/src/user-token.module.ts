import { DatabaseModule, LocalizationModule } from '@app/common'
import Collections from '@app/common/constants/collections.constant'
import Respositories from '@app/common/constants/repositories.constant'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { UserToken, UserTokenSchema } from './schemas/user-token.schema'
import { UserTokenRepository } from './user-token.repository'
import { UserTokenService } from './user-token.service'

@Module({
	imports: [
		DatabaseModule,
		LocalizationModule,
		MongooseModule.forFeature([
			{
				name: UserToken.name,
				schema: UserTokenSchema,
				collection: Collections.USER_TOKENS
			}
		])
	],
	providers: [
		UserTokenService,
		JwtService,
		{
			provide: Respositories.USER_TOKEN,
			useClass: UserTokenRepository
		}
	],
	controllers: [],
	exports: [
		UserTokenService,
		{
			provide: Respositories.USER_TOKEN,
			useClass: UserTokenRepository
		}
	]
})
export class UserTokenModule {}
