import { Module } from '@nestjs/common'
import {
	AcceptLanguageResolver,
	CookieResolver,
	HeaderResolver,
	I18nModule as NestI18nModule,
	QueryResolver
} from 'nestjs-i18n'
import { I18nService } from './i18n.service'

@Module({
	imports: [
		NestI18nModule.forRootAsync({
			useFactory: () => ({
				fallbackLanguage: 'vi',
				loaderOptions: {
					path: 'resources/locales',
					watch: true
				},
				typesOutputPath: process.cwd() + '/resources/locales/i18n.generated.ts'
			}),
			resolvers: [
				{ use: QueryResolver, options: ['lang'] },
				new HeaderResolver(['Accept-Language']),
				new CookieResolver(['NEXT_LOCALE']),
				AcceptLanguageResolver
			]
		})
	],
	exports: [I18nModule, I18nService],
	providers: [I18nService]
})
export class I18nModule {}
