import configuration from '@app/common/configs'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { Collections, LocalizationModule, Respositories } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { UserController } from './controllers/user.controller'
import { UserRepository } from './repositories/user.repository'
import { UserTokenRepository } from './repositories/user-token.repository'
import { UserService } from './services/user.service'
import { UserTokenService } from './services/user-token.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserToken, UserTokenSchema } from './schemas/user-token.schema'
import { UserModelSchema, UserSchema } from './schemas/user.schema'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'AUTH_SERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'auth',
						brokers: ['localhost:9092']
					},
					consumer: {
						groupId: 'auth-consumer'
					}
				}
			}
		]),
		LocalizationModule,
		MongooseModule.forFeature([
			{
				name: UserToken.name,
				schema: UserTokenSchema,
				collection: Collections.USER_TOKENS
			}
		]),
		MongooseModule.forFeatureAsync([
			{
				imports: [ConfigModule],
				name: UserModelSchema.name,
				collection: Collections.USERS,
				useFactory: (configService: ConfigService) => {
					const schema = UserSchema
					schema.methods.authenticate = function (password: string) {
						return compareSync(password, this.password)
					}
					schema.methods.encryptPassword = function (password: string) {
						this.password = hashSync(password, genSaltSync(configService.get('saltRound')))
						return this
					}

					schema.pre('save', function (next) {
						this.password = hashSync(
							this.password,
							genSaltSync(configService.get('saltRound'))
						)
						next()
					})

					return schema
				},
				inject: [ConfigService]
			}
		]),
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
		JwtModule.register({ global: true })
	],
	providers: [
		ConfigService,
		JwtService,
		LocalStrategy,
		AuthService,
		UserService,
		UserTokenService,
		{ provide: Respositories.USER, useClass: UserRepository },
		{ provide: Respositories.USER_TOKEN, useClass: UserTokenRepository }
	],
	controllers: [AuthController, UserController],
	exports: [AuthService]
})
export class UserModule {}
