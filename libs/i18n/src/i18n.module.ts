import { Module } from '@nestjs/common'
import * as NestI18n from 'nestjs-i18n'
import { I18nService } from './i18n.service'

@Module({
	imports: [
		NestI18n.I18nModule.forRootAsync({
			useFactory: () => ({
				fallbackLanguage: 'vi',
				loaderOptions: {
					path: 'i18n',
					watch: true
				}
			}),
			resolvers: [
				{ use: NestI18n.QueryResolver, options: ['lang'] },
				new NestI18n.HeaderResolver(['Accept-Language']),
				new NestI18n.CookieResolver(),
				NestI18n.AcceptLanguageResolver
			]
		})
	],
	exports: [I18nModule, I18nService],
	providers: [I18nService]
})
export class I18nModule {}
