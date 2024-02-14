import configuration from '@app/common/configs'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserTokenModule } from 'apps/user-token/src/user-token.module'
import { UserModule } from 'apps/user/src/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './auth.strategy'

@Module({
	imports: [
		// LocalizationModule,
		UserModule,
		{ module: UserTokenModule, global: true },
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
		JwtModule.register({ global: true })
	],
	providers: [AuthService, ConfigService, JwtService, LocalStrategy],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
