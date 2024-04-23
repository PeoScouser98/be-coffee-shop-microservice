import { Injectable } from '@nestjs/common'
import { PathImpl2 } from '@nestjs/config'
import { I18nService as NestI18nService, I18nContext as NestI18nContext } from 'nestjs-i18n'
import { I18nTranslations } from 'resources/locales/i18n.generated'

@Injectable()
export class I18nService {
	constructor(private readonly i18nService: NestI18nService<I18nTranslations>) {}
	public t(key: PathImpl2<I18nTranslations>): string {
		return this.i18nService.t(key, { lang: NestI18nContext.current().lang })
	}
}
