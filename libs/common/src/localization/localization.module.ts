import { Module } from '@nestjs/common'
import {
	AcceptLanguageResolver,
	CookieResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver
} from 'nestjs-i18n'
import { LocalizationService } from './localization.service'

@Module({
	imports: [
		I18nModule.forRootAsync({
			useFactory: () => ({
				fallbackLanguage: 'vi',
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
			]
		})
	],
	exports: [LocalizationModule, LocalizationService],
	providers: [LocalizationService]
})
export class LocalizationModule {}
