import { Module } from '@nestjs/common'
import {
	I18nModule as NestI18nModule,
	QueryResolver,
	HeaderResolver,
	CookieResolver,
	AcceptLanguageResolver
} from 'nestjs-i18n'
import { I18nService } from './i18n.service'

@Module({
	imports: [
		NestI18nModule.forRootAsync({
			useFactory: () => ({
				fallbackLanguage: 'vi',
				loaderOptions: {
					path: 'locales',
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
	exports: [I18nModule, I18nService],
	providers: [I18nService]
})
export class I18nModule {}
