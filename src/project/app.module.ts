import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GlobalConfigModule } from './modules/configuration/app-configuration.module'
import { DatabaseModule } from './modules/databases/database.module'
import { AuthModule } from './modules/features/auth/auth.module'
import { ProductModule } from './modules/features/products/product.module'
import { UserModule } from './modules/features/user/user.module'
import { UserTokenModule } from './modules/features/user-token/user-token.module'
import { ProductCollectionModule } from './modules/features/product-collections/product-collections.module'
import { ProductLineModule } from './modules/features/product-line/product-line.module'
import { InventoriesModule } from './modules/features/inventories/inventories.module'
import { LocalizationModule } from './modules/localization/localization.module'

@Module({
	imports: [
		/** Global configs */
		GlobalConfigModule,
		/** Database */
		DatabaseModule,
		/** Localization */
		LocalizationModule,
		/** App modules */
		ProductModule,
		ProductCollectionModule,
		AuthModule,
		UserModule,
		UserTokenModule,
		ProductLineModule,
		InventoriesModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
