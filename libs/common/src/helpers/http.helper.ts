import { HttpStatus } from '@nestjs/common/enums'

export class ResponseBody<T> {
	data: T
	message: string
	statusCode: HttpStatus
	timestamps: Date
	constructor(data: T, status: HttpStatus, message: string) {
		this.data = data
		this.message = message
		this.statusCode = status
		this.timestamps = new Date()
		return this
	}
}

export class ServiceResult<T> {
	data?: T | null
	error?: {
		message: string
		errorCode: HttpStatus
	}

	constructor(
		data: T | null,
		error?: {
			message: string
			errorCode: HttpStatus
			description?: string
		}
	) {
		this.data = data
		this.error = error

		return this
	}
}
