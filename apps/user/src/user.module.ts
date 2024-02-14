import 'dotenv/config'

import Collections from '@app/common/constants/collections.constant'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { UserModelSchema, UserSchema } from './schemas/user.schema'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'
import Respositories from '@app/common/constants/repositories.constant'
import { DatabaseModule } from '@app/common/database/database.module'
import { LocalizationModule } from '@app/common'
import { AuthModule } from 'apps/auth/src/auth.module'
import { UserTokenModule } from 'apps/user-token/src/user-token.module'
import configuration from '@app/common/configs'

@Module({
	imports: [
		DatabaseModule,
		forwardRef(() => LocalizationModule),
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
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
		AuthModule,
		UserTokenModule
	],
	providers: [
		ConfigService,
		UserService,

		{ provide: Respositories.USER, useClass: UserRepository }
	],
	controllers: [UserController],
	exports: [UserService, { provide: Respositories.USER, useClass: UserRepository }]
})
export class UserModule {}
