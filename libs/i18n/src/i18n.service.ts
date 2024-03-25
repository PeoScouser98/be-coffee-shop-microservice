import { Injectable } from '@nestjs/common'
import { I18nService as NestI18nService, I18nContext as NestI18nContext } from 'nestjs-i18n'

@Injectable()
export class I18nService {
	constructor(private readonly i18nService: NestI18nService) {}
	public t(key: string): string {
		return this.i18nService.t(key, { lang: NestI18nContext.current().lang })
	}
}
