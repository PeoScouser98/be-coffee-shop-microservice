import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as path from 'path'
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n'
@Global()
@Module({
	imports: [
		ConfigModule,
		I18nModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				fallbackLanguage: configService.getOrThrow('i18n.fallbackLanguage'),
				loaderOptions: {
					path: path.resolve(path.join(__dirname, '/i18n/')),
					watch: true
				}
			}),
			resolvers: [
				{ use: QueryResolver, options: ['locale'] },
				AcceptLanguageResolver,
				new HeaderResolver(['locale'])
			],
			inject: [ConfigService]
		})
	],
	exports: [I18nModule],
	controllers: []
})
export class LocalizationModule {}
