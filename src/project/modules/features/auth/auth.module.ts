import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserTokenModule } from '../user-token/user-token.module'
import { UserTokenService } from '../user-token/user-token.service'
import { UserModule } from '../user/user.module'
import { UserService } from '../user/user.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [ConfigModule, UserModule, UserTokenModule, JwtModule.register({ global: true })],
	providers: [AuthService, ConfigService, JwtService, UserService, UserTokenService],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
