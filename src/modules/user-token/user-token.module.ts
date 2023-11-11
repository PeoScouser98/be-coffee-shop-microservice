import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToken, UserTokenSchema } from './schemas/user-token.schema';
import { UserTokenController } from './user-token.controller';
import { UserTokenRepository } from './user-token.repository';
import { UserTokenService } from './user-token.service';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: UserToken.name,
				useFactory: () => UserTokenSchema,
				collection: 'user_tokens'
			}
		])
	],
	providers: [
		UserTokenService,
		JwtService,
		{
			provide: 'USER_TOKEN_REPOSITORY',
			useClass: UserTokenRepository
		}
	],
	controllers: [UserTokenController],
	exports: [
		UserTokenService,
		{
			provide: 'USER_TOKEN_REPOSITORY',
			useClass: UserTokenRepository
		}
	]
})
export class UserTokenModule {}
