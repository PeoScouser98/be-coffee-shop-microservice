import { Injectable, Global } from '@nestjs/common'
import { I18nContext, I18nService } from 'nestjs-i18n'

@Global()
@Injectable()
export class LocalizationService {
	constructor(private readonly localizationService: I18nService) {}
	public t(key: string): string {
		return this.localizationService.t(key, { lang: I18nContext.current().lang })
	}
}
