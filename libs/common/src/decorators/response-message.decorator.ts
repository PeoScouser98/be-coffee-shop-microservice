import { SetMetadata } from '@nestjs/common'
import { PathImpl2 } from '@nestjs/config'
import { I18nTranslations } from 'resources/locales/i18n.generated'

/**
 * @description Decorator trả message về theo response body
 */
export const ResponseMessageKey = 'RESPONSE_MESSAGE_KEY' as const
export const ResponseMessage = (i18nKey: PathImpl2<I18nTranslations>) =>
	SetMetadata(ResponseMessageKey, i18nKey)
