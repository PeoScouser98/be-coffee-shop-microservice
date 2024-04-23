import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { MailerModule } from '@app/mailer'
import { RmqModule } from '@app/rmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { AuthController } from './controllers/auth.controller'
import { UserController } from './controllers/user.controller'
import { UserTokenRepository } from './repositories/user-token.repository'
import { UserRepository } from './repositories/user.repository'
import { UserToken, UserTokenSchema } from './schemas/user-token.schema'
import { User, UserSchema } from './schemas/user.schema'
import { AuthService } from './services/auth.service'
import { UserTokenService } from './services/user-token.service'
import { UserService } from './services/user.service'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		RmqModule,
		I18nModule,
		DatabaseModule,
		MailerModule,
		JwtModule.register({ global: true }),
		MongooseModule.forFeatureAsync([
			{
				imports: [ConfigModule],
				name: User.name,
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => {
					UserSchema.methods.authenticate = function (password: string) {
						return compareSync(password, this.password)
					}
					UserSchema.pre('save', function (next) {
						this.password = hashSync(
							this.password,
							genSaltSync(+configService.get('BCRYPT_SALT_ROUND'))
						)
						next()
					})
					return UserSchema
				}
			},
			{
				name: UserToken.name,
				useFactory: () => UserTokenSchema
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
		{ provide: UserRepository.name, useClass: UserRepository },
		{ provide: UserTokenRepository.name, useClass: UserTokenRepository }
	],
	controllers: [AuthController, UserController],
	exports: [AuthService, UserTokenService]
})
export class AuthModule {}
