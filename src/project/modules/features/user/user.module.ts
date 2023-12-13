import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { User, UserSchema } from './schemas/user.schema'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'
import 'dotenv/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserTokenModule } from '../user-token/user-token.module'
import { AuthService } from '../auth/auth.service'
import { AuthModule } from '../auth/auth.module'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				imports: [ConfigModule],
				name: User.name,
				useFactory: (configService: ConfigService) => {
					const schema = UserSchema
					schema.methods.authenticate = function (password: string) {
						return compareSync(password, this.password)
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
				inject: [ConfigService],
				collection: 'users'
			}
		]),
		forwardRef(() => AuthModule),
		UserTokenModule,
		ConfigModule
	],
	providers: [
		ConfigService,
		UserService,
		AuthService,
		{ provide: 'USER_REPOSITORY', useClass: UserRepository }
	],
	controllers: [UserController],
	exports: [UserService, { provide: 'USER_REPOSITORY', useClass: UserRepository }]
})
export class UserModule {}
