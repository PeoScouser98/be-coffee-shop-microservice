import { HttpException } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { JsonWebTokenError } from 'jsonwebtoken'

export class HttpResponse<T> {
	metadata: T
	message: Record<Locale, string>
	statusCode: HttpStatus
	constructor(data: T, status: HttpStatus, message: Record<Locale, string>) {
		this.metadata = data
		this.message = message
		this.statusCode = status

		return this
	}
}

export class HttpErrorResponse {
	message: string
	statusCode: number
	constructor(error: HttpException | Error) {
		this.message = error.message
		this.statusCode =
			error instanceof HttpException
				? error.getStatus()
				: error instanceof JsonWebTokenError
				? HttpStatus.UNAUTHORIZED
				: HttpStatus.INTERNAL_SERVER_ERROR

		return this
	}
}

export class ServiceResponse<T> {
	data: T | null
	error:
		| {
				message: Record<Locale, string>
				errorCode: HttpStatus
		  }
		| null
		| undefined

	constructor(
		data: T | null,
		error?: {
			message: Record<Locale, string>
			errorCode: HttpStatus
			description?: string
		}
	) {
		this.data = data
		this.error = error

		return this
	}
}
