import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalConfigModule } from './configs/app-configuration.module';
import { DatabaseModule } from './databases/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/products/product.module';
import { UserModule } from './modules/user/user.module';
import { UserTokenModule } from './modules/user-token/user-token.module';

@Module({
	imports: [
		/** Global configs */
		GlobalConfigModule,
		/** Database */
		DatabaseModule,
		/** App modules */
		ProductModule,
		AuthModule,
		UserModule,
		UserTokenModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
