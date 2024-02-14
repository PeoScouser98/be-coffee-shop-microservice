import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
	I18nModule,
	AcceptLanguageResolver,
	QueryResolver,
	HeaderResolver,
	CookieResolver
} from 'nestjs-i18n'
import { LocalizationService } from './localization.service'
import configuration from '../configs'
@Global()
@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
		I18nModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				fallbackLanguage: configService.getOrThrow('i18n.fallbackLanguage'),
				loaderOptions: {
					path: 'i18n',
					watch: true
				}
			}),
			resolvers: [
				{ use: QueryResolver, options: ['lang'] },
				new HeaderResolver(['Accept-Language']),
				new CookieResolver(),
				AcceptLanguageResolver
			],
			inject: [ConfigService]
		})
	],
	exports: [LocalizationModule, LocalizationService],
	providers: [LocalizationService]
})
export class LocalizationModule {}
