import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { HttpAdapterHost, Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ResponseMessageKey } from '../decorators/response-message.decorator'
import { I18nService } from '@app/i18n'
import { PathImpl2 } from '@nestjs/config'
import { I18nTranslations } from 'resources/locales/i18n.generated'

export interface Response<T> {
	data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
	constructor(
		private reflector: Reflector,
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly i18nService: I18nService
	) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		const i18nKey = this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ?? ''
		// const { httpAdapter } = this.httpAdapterHost
		return next.handle().pipe(
			map((data) => ({
				data,
				statusCode: context.switchToHttp().getResponse().statusCode,
				message: this.i18nService.t(i18nKey as PathImpl2<I18nTranslations>),
				timestamp: new Date().toISOString()
				// path: httpAdapter.getRequestUrl(context.switchToHttp().getRequest())
			}))
		)
	}
}
