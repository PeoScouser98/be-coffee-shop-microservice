import { Injectable, Global } from '@nestjs/common'
import * as NestI18n from 'nestjs-i18n'

@Global()
@Injectable()
export class I18nService {
	constructor(private readonly i18nService: NestI18n.I18nService) {}
	public t(key: string): string {
		return this.i18nService.t(key, { lang: NestI18n.I18nContext.current().lang })
	}
}
