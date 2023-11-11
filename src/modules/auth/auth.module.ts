import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserTokenModule } from '../user-token/user-token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Module({
	imports: [
		ConfigModule,
		UserModule,
		UserTokenModule,
		JwtModule.register({ global: true })
	],
	providers: [AuthService, ConfigService, JwtService, UserService],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
