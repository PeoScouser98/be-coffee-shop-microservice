import { DatabaseModule, LocalizationModule, RmqModule } from '@app/common'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import {
	USER_COLLECTION,
	USER_REPOSITORY,
	USER_TOKEN_COLLECTION,
	USER_TOKEN_REPOSITORY
} from './constants/user.constant'
import { AuthController } from './controllers/auth.controller'
import { UserController } from './controllers/user.controller'
import { UserTokenRepository } from './repositories/user-token.repository'
import { UserRepository } from './repositories/user.repository'
import { UserToken, UserTokenSchema } from './schemas/user-token.schema'
import { UserModelSchema, UserSchema } from './schemas/user.schema'
import { AuthService } from './services/auth.service'
import { UserTokenService } from './services/user-token.service'
import { UserService } from './services/user.service'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: './apps/user/.env'
		}),
		RmqModule,
		LocalizationModule,
		DatabaseModule,
		JwtModule.register({ global: true }),
		MongooseModule.forFeature([
			{
				name: UserToken.name,
				schema: UserTokenSchema,
				collection: USER_TOKEN_COLLECTION
			}
		]),
		MongooseModule.forFeatureAsync([
			{
				imports: [ConfigModule],
				name: UserModelSchema.name,
				collection: USER_COLLECTION,
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => {
					const schema = UserSchema
					schema.methods.authenticate = function (password: string) {
						return compareSync(password, this.password)
					}
					schema.methods.encryptPassword = function (password: string) {
						this.password = hashSync(
							password,
							genSaltSync(+configService.get('BCRYPT_SALT_ROUND'))
						)
						return this
					}

					schema.pre('save', function (next) {
						this.password = hashSync(
							this.password,
							genSaltSync(+configService.get('BCRYPT_SALT_ROUND'))
						)
						next()
					})

					return schema
				}
			}
		])
	],
	providers: [
		ConfigService,
		JwtService,
		LocalStrategy,
		AuthService,
		UserService,
		UserTokenService,
		{ provide: USER_REPOSITORY, useClass: UserRepository },
		{ provide: USER_TOKEN_REPOSITORY, useClass: UserTokenRepository }
	],
	controllers: [AuthController, UserController],
	exports: [AuthService]
})
export class UserModule {}
